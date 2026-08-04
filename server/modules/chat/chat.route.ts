import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { createGroupSchema, sendMessageSchema, readReceiptSchema } from './chat.schema.js';
import * as chatController from './chat.controller.js';

const router = Router();

router.use(authenticate);

router.post('/group', validateRequest(createGroupSchema), chatController.createGroup);
router.post('/message', validateRequest(sendMessageSchema), chatController.sendMessage);
router.post('/read', validateRequest(readReceiptSchema), chatController.markAsRead);
router.get('/groups', chatController.getMyGroups);
router.get('/messages/:groupId', chatController.getMessages);

export default router;
