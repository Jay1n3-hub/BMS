import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from '../controllers/tasks.controller';
import { requireFields } from '../middleware/validate';

const router = Router();

router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/', requireFields(['sprintId', 'title']), createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
