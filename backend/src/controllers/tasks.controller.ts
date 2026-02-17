import { Response } from 'express';
import { Criticality, TaskStatus } from '@prisma/client';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';

export async function listTasks(req: AuthRequest, res: Response) {
  const tasks = await db.task.findMany({
    where: { sprint: { project: { ownerId: req.user!.userId } } },
    include: { blockers: true },
    orderBy: { updatedAt: 'desc' },
  });
  return res.json(tasks);
}

export async function getTask(req: AuthRequest, res: Response) {
  const task = await db.task.findFirst({
    where: { id: req.params.id, sprint: { project: { ownerId: req.user!.userId } } },
    include: { blockers: true },
  });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  return res.json(task);
}

export async function createTask(req: AuthRequest, res: Response) {
  const { sprintId, title, description, status, points, criticality, assignee } = req.body as {
    sprintId: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    points?: number;
    criticality?: Criticality;
    assignee?: string;
  };

  const sprint = await db.sprint.findFirst({ where: { id: sprintId, project: { ownerId: req.user!.userId } } });
  if (!sprint) return res.status(404).json({ message: 'Sprint not found' });

  const created = await db.task.create({
    data: {
      sprintId,
      title,
      description,
      status,
      points,
      criticality,
      assignee,
    },
  });
  return res.status(201).json(created);
}

export async function updateTask(req: AuthRequest, res: Response) {
  const existing = await db.task.findFirst({ where: { id: req.params.id, sprint: { project: { ownerId: req.user!.userId } } } });
  if (!existing) return res.status(404).json({ message: 'Task not found' });

  const { title, description, status, points, criticality, assignee } = req.body as {
    title?: string;
    description?: string;
    status?: TaskStatus;
    points?: number;
    criticality?: Criticality;
    assignee?: string;
  };

  const updated = await db.task.update({
    where: { id: req.params.id },
    data: { title, description, status, points, criticality, assignee },
  });
  return res.json(updated);
}

export async function deleteTask(req: AuthRequest, res: Response) {
  const existing = await db.task.findFirst({ where: { id: req.params.id, sprint: { project: { ownerId: req.user!.userId } } } });
  if (!existing) return res.status(404).json({ message: 'Task not found' });

  await db.task.delete({ where: { id: req.params.id } });
  return res.status(204).send();
}
