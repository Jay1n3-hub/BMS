import { Response } from 'express';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { computeProjectHealth, taskCounters } from '../utils/health';

function parseDate(value?: string) {
  return value ? new Date(value) : undefined;
}

export async function listProjects(req: AuthRequest, res: Response) {
  const projects = await db.project.findMany({
    where: { ownerId: req.user!.userId },
    include: {
      sprints: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { tasks: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const enriched = projects.map((project) => {
    const activeSprint = project.sprints[0];
    const statuses = activeSprint?.tasks.map((t) => t.status) ?? [];
    const counters = taskCounters(statuses);
    const health = computeProjectHealth({
      ...counters,
      sprintStart: activeSprint?.startDate,
      sprintEnd: activeSprint?.endDate,
    });

    return {
      ...project,
      health,
      progress: `${counters.doneTasks}/${counters.totalTasks}`,
      sprints: undefined,
    };
  });

  return res.json(enriched);
}

export async function getProject(req: AuthRequest, res: Response) {
  const project = await db.project.findFirst({
    where: { id: req.params.id, ownerId: req.user!.userId },
    include: {
      sprints: {
        include: {
          tasks: {
            include: { blockers: true },
          },
        },
      },
    },
  });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json(project);
}

export async function createProject(req: AuthRequest, res: Response) {
  const { name, description, startDate, targetEnd } = req.body as {
    name: string;
    description?: string;
    startDate?: string;
    targetEnd?: string;
  };

  const created = await db.project.create({
    data: {
      ownerId: req.user!.userId,
      name,
      description,
      startDate: parseDate(startDate),
      targetEnd: parseDate(targetEnd),
    },
  });

  return res.status(201).json(created);
}

export async function updateProject(req: AuthRequest, res: Response) {
  const existing = await db.project.findFirst({ where: { id: req.params.id, ownerId: req.user!.userId } });
  if (!existing) return res.status(404).json({ message: 'Project not found' });

  const { name, description, startDate, targetEnd } = req.body as {
    name?: string;
    description?: string;
    startDate?: string;
    targetEnd?: string;
  };

  const updated = await db.project.update({
    where: { id: req.params.id },
    data: {
      name,
      description,
      startDate: startDate ? parseDate(startDate) : undefined,
      targetEnd: targetEnd ? parseDate(targetEnd) : undefined,
    },
  });

  return res.json(updated);
}

export async function deleteProject(req: AuthRequest, res: Response) {
  const existing = await db.project.findFirst({ where: { id: req.params.id, ownerId: req.user!.userId } });
  if (!existing) return res.status(404).json({ message: 'Project not found' });

  await db.project.delete({ where: { id: req.params.id } });
  return res.status(204).send();
}

export async function projectHealth(req: AuthRequest, res: Response) {
  const sprint = await db.sprint.findFirst({
    where: { projectId: req.params.id, project: { ownerId: req.user!.userId } },
    include: { tasks: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!sprint) {
    return res.json({ progress: 0, timeElapsed: null, health: 'AT_RISK' });
  }

  const counters = taskCounters(sprint.tasks.map((t) => t.status));
  const health = computeProjectHealth({
    ...counters,
    sprintStart: sprint.startDate,
    sprintEnd: sprint.endDate,
  });

  return res.json({
    ...health,
    done: counters.doneTasks,
    total: counters.totalTasks,
    blocked: counters.blockedTasks,
  });
}
