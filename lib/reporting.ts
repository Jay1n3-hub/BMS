import dayjs from "dayjs";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { summarizeWeeklyImprovements } from "@/lib/llm";

export const buildWeeklySnapshot = async (start: Date, end: Date) => {
  const blockers = await prisma.blocker.findMany({
    where: {
      createdAt: { gte: start, lte: end }
    }
  });

  const resolved = blockers.filter((b) => b.status === "RESOLVED");
  const avgUnblockHours =
    resolved.length === 0
      ? 0
      :
          resolved.reduce((sum, b) => {
            return sum + dayjs(b.updatedAt).diff(dayjs(b.createdAt), "hour");
          }, 0) / resolved.length;

  const categoryCounts = blockers.reduce<Record<string, number>>((acc, blocker) => {
    acc[blocker.category] = (acc[blocker.category] || 0) + 1;
    return acc;
  }, {});

  const summary = {
    period: { start: start.toISOString(), end: end.toISOString() },
    created: blockers.length,
    resolved: resolved.length,
    avgTimeToUnblockHours: Number(avgUnblockHours.toFixed(2)),
    topCategories: Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }))
  };

  const improvements = await summarizeWeeklyImprovements(summary);
  return { blockers, summary, improvements };
};

export const generateCSV = (rows: Array<Record<string, unknown>>) => {
  const parser = new Parser();
  return parser.parse(rows);
};

export const generatePdfBuffer = async (title: string, bodyLines: string[]) => {
  const doc = new PDFDocument({ margin: 40 });
  const chunks: Uint8Array[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(18).text(title, { underline: true });
  doc.moveDown();
  bodyLines.forEach((line) => doc.fontSize(12).text(`• ${line}`));
  doc.end();

  return done;
};
