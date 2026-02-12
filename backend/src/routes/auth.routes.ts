import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { requireFields } from '../middleware/validate';

const router = Router();

router.post('/register', requireFields(['email', 'password']), register);
router.post('/login', requireFields(['email', 'password']), login);

export default router;
