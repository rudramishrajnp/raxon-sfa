import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { applyLeaveSchema, reviewLeaveSchema } from './leave.schema.js';
import * as leaveController from './leave.controller.js';

const router = Router();

router.use(authenticate);

// Employee routes
router.post('/apply', validateRequest(applyLeaveSchema), leaveController.applyLeave);
router.get('/my-leaves', leaveController.getMyLeaves);
router.get('/my-balances', leaveController.getMyBalances);

// Manager routes
router.post('/review', authorize(['AM', 'RM', 'ADMIN', 'SUPER_ADMIN']), validateRequest(reviewLeaveSchema), leaveController.reviewLeave);

export default router;
