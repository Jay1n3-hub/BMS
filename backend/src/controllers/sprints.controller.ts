import { Response } from 'express';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';

function parseDate(value?: string) {
  return value ? new Date(value) : undefined;
}

export async function listSprints(req: AuthRequest, res: Response) {
  const sprints = await db.sprint.findMany({
    where: { project: { ownerId: req.user!.userId } },
    include: { tasks: true },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(sprints);
}

export async function getSprint(req: AuthRequest, res: Response) {
  const sprint = await db.sprint.findFirst({
    where: { id: req.params.id, project: { ownerId: req.user!.userId } },
    include: { tasks: true },
  });
  if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
  return res.json(sprint);
}

export async function createSprint(req: AuthRequest, res: Response) {
  const { projectId, name, goal, startDate, endDate } = req.body as {
    projectId: string;
    name: string;
    goal?: string;
    startDate?: string;
    endDate?: string;
  };

  const project = await db.project.findFirst({ where: { id: projectId, ownerId: req.user!.userId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const sprint = await db.sprint.create({
    data: {
      projectId,
      name,
      goal,
      startDate: parseDate(startDate),
      endDate: parseDate(endDate),
    },
  });
  return res.status(201).json(sprint);
}

export async function updateSprint(req: AuthRequest, res: Response) {
  const existing = await db.sprint.findFirst({ where: { id: req.params.id, project: { ownerId: req.user!.userId } } });
  if (!existing) return res.status(404).json({ message: 'Sprint not found' });

  const { name, goal, startDate, endDate } = req.body as {
    name?: string;
    goal?: string;
    startDate?: string;
    endDate?: string;
  };

  const sprint = await db.sprint.update({
    where: { id: req.params.id },
    data: {
      name,
      goal,
      startDate: startDate ? parseDate(startDate) : undefined,
      endDate: endDate ? parseDate(endDate) : undefined,
    },
  });
  return res.json(sprint);
}

export async function deleteSprint(req: AuthRequest, res: Response) {
  const existing = await db.sprint.findFirst({ where: { id: req.params.id, project: { ownerId: req.user!.userId } } });
  if (!existing) return res.status(404).json({ message: 'Sprint not found' });

  await db.sprint.delete({ where: { id: req.params.id } });
  return res.status(204).send();
}
