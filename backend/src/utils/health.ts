import { TaskStatus } from '@prisma/client';

export type ProjectHealthStatus = 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';

export type HealthInput = {
  totalTasks: number;
  doneTasks: number;
  blockedTasks: number;
  sprintStart?: Date | null;
  sprintEnd?: Date | null;
};

export type HealthResult = {
  progress: number;
  timeElapsed: number | null;
  health: ProjectHealthStatus;
};

export function computeProjectHealth(input: HealthInput): HealthResult {
  const progress = input.totalTasks > 0 ? input.doneTasks / input.totalTasks : 0;
  const timeElapsed = computeTimeElapsed(input.sprintStart, input.sprintEnd);

  if (input.totalTasks === 0) {
    return { progress, timeElapsed, health: 'AT_RISK' };
  }

  if (input.blockedTasks / input.totalTasks >= 0.4) {
    return { progress, timeElapsed, health: 'OFF_TRACK' };
  }

  if (timeElapsed !== null) {
    if (progress + 0.1 >= timeElapsed) {
      return { progress, timeElapsed, health: 'ON_TRACK' };
    }
    if (progress + 0.25 >= timeElapsed) {
      return { progress, timeElapsed, health: 'AT_RISK' };
    }
    return { progress, timeElapsed, health: 'OFF_TRACK' };
  }

  if (progress >= 0.7) return { progress, timeElapsed, health: 'ON_TRACK' };
  if (progress >= 0.4) return { progress, timeElapsed, health: 'AT_RISK' };
  return { progress, timeElapsed, health: 'OFF_TRACK' };
}

function computeTimeElapsed(start?: Date | null, end?: Date | null): number | null {
  if (!start || !end) return null;
  const now = Date.now();
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (endMs <= startMs) return null;
  const elapsed = (now - startMs) / (endMs - startMs);
  return Math.max(0, Math.min(1, elapsed));
}

export function taskCounters(statuses: TaskStatus[]) {
  const totalTasks = statuses.length;
  const doneTasks = statuses.filter((s) => s === 'DONE').length;
  const blockedTasks = statuses.filter((s) => s === 'BLOCKED').length;
  return { totalTasks, doneTasks, blockedTasks };
}
