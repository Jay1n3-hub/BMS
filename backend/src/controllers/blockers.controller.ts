import { Response } from 'express';
import { BlockerStatus, BlockerCategory, Severity } from '@prisma/client';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';

function parseDate(value?: string) {
  return value ? new Date(value) : undefined;
}

export async function listBlockers(req: AuthRequest, res: Response) {
  const blockers = await db.blocker.findMany({
    where: { task: { sprint: { project: { ownerId: req.user!.userId } } } },
    include: { task: { include: { sprint: { include: { project: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(blockers);
}

export async function getBlocker(req: AuthRequest, res: Response) {
  const blocker = await db.blocker.findFirst({
    where: { id: req.params.id, task: { sprint: { project: { ownerId: req.user!.userId } } } },
  });
  if (!blocker) return res.status(404).json({ message: 'Blocker not found' });
  return res.json(blocker);
}

export async function createBlocker(req: AuthRequest, res: Response) {
  const {
    taskId,
    category,
    severity,
    description,
    followUpAt,
    escalateAfterHrs,
    dependencyOwner,
    estimatedDelayDays,
    jiraIssueKey,
    jiraIssueUrl,
  } = req.body as {
    taskId: string;
    category: BlockerCategory;
    severity: Severity;
    description: string;
    followUpAt?: string;
    escalateAfterHrs?: number;
    dependencyOwner?: string;
    estimatedDelayDays?: number;
    jiraIssueKey?: string;
    jiraIssueUrl?: string;
  };

  const task = await db.task.findFirst({ where: { id: taskId, sprint: { project: { ownerId: req.user!.userId } } } });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const created = await db.blocker.create({
    data: {
      taskId,
      category,
      severity,
      description,
      followUpAt: parseDate(followUpAt),
      escalateAfterHrs,
      dependencyOwner,
      estimatedDelayDays,
      jiraIssueKey,
      jiraIssueUrl,
    },
  });
  return res.status(201).json(created);
}

export async function updateBlocker(req: AuthRequest, res: Response) {
  const existing = await db.blocker.findFirst({ where: { id: req.params.id, task: { sprint: { project: { ownerId: req.user!.userId } } } } });
  if (!existing) return res.status(404).json({ message: 'Blocker not found' });

  const {
    category,
    severity,
    description,
    status,
    followUpAt,
    escalateAfterHrs,
    dependencyOwner,
    estimatedDelayDays,
    jiraIssueKey,
    jiraIssueUrl,
  } = req.body as {
    category?: BlockerCategory;
    severity?: Severity;
    description?: string;
    status?: BlockerStatus;
    followUpAt?: string;
    escalateAfterHrs?: number;
    dependencyOwner?: string;
    estimatedDelayDays?: number;
    jiraIssueKey?: string;
    jiraIssueUrl?: string;
  };

  const resolvedAt = status === 'RESOLVED' ? new Date() : undefined;

  const updated = await db.blocker.update({
    where: { id: req.params.id },
    data: {
      category,
      severity,
      description,
      status,
      resolvedAt,
      followUpAt: followUpAt ? parseDate(followUpAt) : undefined,
      escalateAfterHrs,
      dependencyOwner,
      estimatedDelayDays,
      jiraIssueKey,
      jiraIssueUrl,
    },
  });

  return res.json(updated);
}

export async function deleteBlocker(req: AuthRequest, res: Response) {
  const existing = await db.blocker.findFirst({ where: { id: req.params.id, task: { sprint: { project: { ownerId: req.user!.userId } } } } });
  if (!existing) return res.status(404).json({ message: 'Blocker not found' });

  await db.blocker.delete({ where: { id: req.params.id } });
  return res.status(204).send();
}
