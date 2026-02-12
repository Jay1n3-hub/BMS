import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { buildWeeklySnapshot, generateCSV, generatePdfBuffer } from "@/lib/reporting";
import { addJiraComment } from "@/lib/jira";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";
  const startDate = searchParams.get("startDate");
  const jiraIssueKey = searchParams.get("jiraIssueKey");

  const start = startDate ? dayjs(startDate).startOf("day") : dayjs().subtract(6, "day").startOf("day");
  const end = start.add(6, "day").endOf("day");

  const snapshot = await buildWeeklySnapshot(start.toDate(), end.toDate());

  if (jiraIssueKey) {
    await addJiraComment(
      jiraIssueKey,
      `Weekly blocker report: created ${snapshot.summary.created}, resolved ${snapshot.summary.resolved}, avg unblock ${snapshot.summary.avgTimeToUnblockHours}h.`
    );
  }

  if (format === "csv") {
    const csv = generateCSV(
      snapshot.blockers.map((b) => ({
        id: b.id,
        team: b.team,
        sprint: b.sprint,
        category: b.category,
        status: b.status,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        jiraKey: b.jiraKey || ""
      }))
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=weekly-report-${start.format("YYYY-MM-DD")}.csv`
      }
    });
  }

  if (format === "pdf") {
    const pdf = await generatePdfBuffer("BlockerPilot Weekly Report", [
      `Period: ${start.format("YYYY-MM-DD")} to ${end.format("YYYY-MM-DD")}`,
      `Created: ${snapshot.summary.created}`,
      `Resolved: ${snapshot.summary.resolved}`,
      `Avg time-to-unblock: ${snapshot.summary.avgTimeToUnblockHours}h`,
      `Top categories: ${snapshot.summary.topCategories.map((c) => `${c.name} (${c.count})`).join(", ") || "n/a"}`,
      `Recommended improvements: ${snapshot.improvements}`
    ]);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=weekly-report-${start.format("YYYY-MM-DD")}.pdf`
      }
    });
  }

  return NextResponse.json(snapshot);
}
