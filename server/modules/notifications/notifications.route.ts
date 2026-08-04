import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { registerTokenSchema, markReadSchema, broadcastSchema } from './notifications.schema.js';
import * as notificationsController from './notifications.controller.js';

const router = Router();

router.use(authenticate);

router.post('/token', validateRequest(registerTokenSchema), notificationsController.registerToken);
router.get('/', notificationsController.getMyNotifications);
router.get('/unread-count', notificationsController.getUnreadCount);
router.post('/read', validateRequest(markReadSchema), notificationsController.markAsRead);

router.post('/broadcast', authorize(['ADMIN', 'SUPER_ADMIN']), validateRequest(broadcastSchema), notificationsController.broadcast);

export default router;
