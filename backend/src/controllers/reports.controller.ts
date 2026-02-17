import { Response } from 'express';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { toCsv } from '../utils/csv';
import { computeProjectHealth, taskCounters } from '../utils/health';

function rangeFor(type: string) {
  const end = new Date();
  const start = new Date();
  if (type === 'daily') {
    start.setDate(end.getDate() - 1);
  } else {
    start.setDate(end.getDate() - 7);
  }
  return { start, end };
}

export async function reportSummary(req: AuthRequest, res: Response) {
  const type = String(req.query.type ?? 'daily');
  const { start } = rangeFor(type);

  const projects = await db.project.findMany({
    where: { ownerId: req.user!.userId },
    include: {
      sprints: {
        include: { tasks: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const perProject = projects.map((project) => {
    const sprint = project.sprints[0];
    const counters = taskCounters(sprint?.tasks.map((t) => t.status) ?? []);
    const health = computeProjectHealth({
      ...counters,
      sprintStart: sprint?.startDate,
      sprintEnd: sprint?.endDate,
    });

    return {
      projectId: project.id,
      projectName: project.name,
      done: counters.doneTasks,
      total: counters.totalTasks,
      blocked: counters.blockedTasks,
      progress: health.progress,
      timeElapsed: health.timeElapsed,
      health: health.health,
    };
  });

  const blockers = await db.blocker.findMany({
    where: {
      task: { sprint: { project: { ownerId: req.user!.userId } } },
      createdAt: { gte: start },
    },
  });

  const topBlockersByCategory = Object.entries(
    blockers.reduce<Record<string, number>>((acc, b) => {
      acc[b.category] = (acc[b.category] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const aggregateEtaImpact = blockers.reduce((acc, b) => acc + (b.estimatedDelayDays ?? 0), 0);

  return res.json({
    type,
    generatedAt: new Date().toISOString(),
    summary: {
      projects: projects.length,
      blockers: blockers.length,
      aggregateEtaImpact,
    },
    perProject,
    topBlockersByCategory,
  });
}

export async function sprintHealthReport(req: AuthRequest, res: Response) {
  const sprints = await db.sprint.findMany({
    where: { project: { ownerId: req.user!.userId } },
    include: { tasks: true, project: true },
    orderBy: { createdAt: 'desc' },
  });

  const data = sprints.map((s) => {
    const counters = taskCounters(s.tasks.map((t) => t.status));
    const health = computeProjectHealth({
      ...counters,
      sprintStart: s.startDate,
      sprintEnd: s.endDate,
    });

    return {
      sprintId: s.id,
      sprintName: s.name,
      projectId: s.projectId,
      projectName: s.project.name,
      done: counters.doneTasks,
      total: counters.totalTasks,
      blocked: counters.blockedTasks,
      progress: health.progress,
      timeElapsed: health.timeElapsed,
      health: health.health,
    };
  });

  return res.json({ generatedAt: new Date().toISOString(), data });
}

export async function exportReportCsv(req: AuthRequest, res: Response) {
  const type = String(req.query.type ?? 'weekly');
  const { start } = rangeFor(type);

  const blockers = await db.blocker.findMany({
    where: {
      task: { sprint: { project: { ownerId: req.user!.userId } } },
      createdAt: { gte: start },
    },
    include: { task: { include: { sprint: { include: { project: true } } } } },
  });

  const rows = blockers.map((b) => ({
    blockerId: b.id,
    project: b.task.sprint.project.name,
    sprint: b.task.sprint.name,
    task: b.task.title,
    category: b.category,
    severity: b.severity,
    status: b.status,
    estimatedDelayDays: b.estimatedDelayDays ?? 0,
    createdAt: b.createdAt.toISOString(),
  }));

  const csv = toCsv(rows);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${type}-report.csv"`);
  return res.status(200).send(csv);
}
