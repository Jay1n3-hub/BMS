import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes';
import projectsRoutes from './routes/projects.routes';
import sprintsRoutes from './routes/sprints.routes';
import tasksRoutes from './routes/tasks.routes';
import blockersRoutes from './routes/blockers.routes';
import reportsRoutes from './routes/reports.routes';
import { authMiddleware } from './middleware/auth';
import { errorMiddleware } from './middleware/error';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'bms-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectsRoutes);
app.use('/api/sprints', authMiddleware, sprintsRoutes);
app.use('/api/tasks', authMiddleware, tasksRoutes);
app.use('/api/blockers', authMiddleware, blockersRoutes);
app.use('/api/reports', authMiddleware, reportsRoutes);

app.use(errorMiddleware);

export default app;
