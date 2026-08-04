import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { loginSchema, refreshTokenSchema } from './auth.schema.js';
import { login, refreshToken, logout, me } from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshTokenSchema), refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
