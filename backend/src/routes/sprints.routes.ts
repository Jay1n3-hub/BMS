import { Router } from 'express';
import {
  createSprint,
  deleteSprint,
  getSprint,
  listSprints,
  updateSprint,
} from '../controllers/sprints.controller';
import { requireFields } from '../middleware/validate';

const router = Router();

router.get('/', listSprints);
router.get('/:id', getSprint);
router.post('/', requireFields(['projectId', 'name']), createSprint);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);

export default router;
