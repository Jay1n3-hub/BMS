import { Router } from 'express';
import {
  createBlocker,
  deleteBlocker,
  getBlocker,
  listBlockers,
  updateBlocker,
} from '../controllers/blockers.controller';
import { requireFields } from '../middleware/validate';

const router = Router();

router.get('/', listBlockers);
router.get('/:id', getBlocker);
router.post('/', requireFields(['taskId', 'category', 'severity', 'description']), createBlocker);
router.put('/:id', updateBlocker);
router.delete('/:id', deleteBlocker);

export default router;
