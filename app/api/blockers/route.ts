import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { classifyBlocker } from "@/lib/llm";
import { createJiraIssue } from "@/lib/jira";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const category = searchParams.get("category") || undefined;
  const sprint = searchParams.get("sprint") || undefined;

  const blockers = await prisma.blocker.findMany({
    where: {
      status,
      category,
      sprint
    },
    orderBy: { createdAt: "desc" },
    include: { comments: true }
  });

  return NextResponse.json({ blockers });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, team, sprint, urgency } = body;

  if (!text || !team || !sprint || !urgency) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const classification = await classifyBlocker(text, { team, sprint, urgency });

  const jiraIssue = await createJiraIssue({
    summary: `[${team}] ${classification.category} blocker`,
    description: `${text}\n\nAction Plan: ${JSON.stringify(classification.actionPlan, null, 2)}`
  });

  const blocker = await prisma.blocker.create({
    data: {
      text,
      team,
      sprint,
      urgency,
      category: classification.category,
      confidence: classification.confidence,
      actionPlan: classification.actionPlan,
      jiraKey: jiraIssue?.key,
      jiraUrl: jiraIssue?.self,
      jiraIssueId: jiraIssue?.id,
      status: "OPEN"
    }
  });

  return NextResponse.json({ blocker, classification });
}
