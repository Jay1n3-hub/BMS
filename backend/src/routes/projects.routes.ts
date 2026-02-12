import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  projectHealth,
  updateProject,
} from '../controllers/projects.controller';
import { requireFields } from '../middleware/validate';

const router = Router();

router.get('/', listProjects);
router.get('/:id', getProject);
router.get('/:id/health', projectHealth);
router.post('/', requireFields(['name']), createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
