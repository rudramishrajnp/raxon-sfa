import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { 
  createDraftSchema, 
  updateMtpSchema, 
  submitMtpSchema, 
  reviewMtpSchema 
} from './mtp.schema.js';
import * as mtpController from './mtp.controller.js';

const router = Router();

// All MTP routes require authentication
router.use(authenticate);

// Employee routes
router.post('/draft', authorize(['MR', 'AM', 'RM']), validateRequest(createDraftSchema), mtpController.saveDraft);
router.put('/update', authorize(['MR', 'AM', 'RM']), validateRequest(updateMtpSchema), mtpController.updateMtp);
router.post('/submit', authorize(['MR', 'AM', 'RM']), validateRequest(submitMtpSchema), mtpController.submitMtp);
router.get('/current', authorize(['MR', 'AM', 'RM']), mtpController.getCurrentMtp);
router.get('/history', authorize(['MR', 'AM', 'RM']), mtpController.getHistory);
router.get('/status', authorize(['MR', 'AM', 'RM']), mtpController.getStatus);
router.get('/calendar', authorize(['MR', 'AM', 'RM']), mtpController.getCalendar);

// Manager routes (AM, RM, ADMIN, SUPER_ADMIN)
router.post('/approve', authorize(['AM', 'RM', 'ADMIN', 'SUPER_ADMIN']), validateRequest(reviewMtpSchema), mtpController.approveMtp);
router.post('/reject', authorize(['AM', 'RM', 'ADMIN', 'SUPER_ADMIN']), validateRequest(reviewMtpSchema), mtpController.rejectMtp);

export default router;
