import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addJiraComment } from "@/lib/jira";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const blockerId = Number(params.id);
  if (Number.isNaN(blockerId)) {
    return NextResponse.json({ error: "Invalid blocker id" }, { status: 400 });
  }

  const payload = await request.json();
  const { status, followUpAt, comment, createdBy } = payload;

  const blocker = await prisma.blocker.update({
    where: { id: blockerId },
    data: {
      status: status || undefined,
      followUpAt: followUpAt ? new Date(followUpAt) : undefined
    }
  });

  let commentRecord = null;
  if (comment) {
    const jiraSynced = blocker.jiraKey ? await addJiraComment(blocker.jiraKey, comment) : false;
    commentRecord = await prisma.blockerComment.create({
      data: {
        blockerId,
        text: comment,
        createdBy,
        jiraSynced
      }
    });
  }

  return NextResponse.json({ blocker, comment: commentRecord });
}
