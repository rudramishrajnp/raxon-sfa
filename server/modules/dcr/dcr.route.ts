import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { saveDcrSchema, submitDcrSchema, checkInSchema, checkOutSchema, offlineSyncSchema } from './dcr.schema.js';
import * as dcrController from './dcr.controller.js';
import * as dcrExecutionController from './dcr.execution.controller.js';

const router = Router();

router.use(authenticate);

// Core DCR endpoints
router.post('/draft', authorize(['MR', 'AM', 'RM']), validateRequest(saveDcrSchema), dcrController.saveDraft);
router.post('/submit', authorize(['MR', 'AM', 'RM']), validateRequest(submitDcrSchema), dcrController.submitDcr);
router.get('/current', authorize(['MR', 'AM', 'RM']), dcrController.getDcr);
router.get('/history', authorize(['MR', 'AM', 'RM']), dcrController.getHistory);

// Execution endpoints (Batch 2)
router.post('/check-in', authorize(['MR', 'AM', 'RM']), validateRequest(checkInSchema), dcrExecutionController.checkIn);
router.post('/check-out', authorize(['MR', 'AM', 'RM']), validateRequest(checkOutSchema), dcrExecutionController.checkOut);
router.post('/offline-sync', authorize(['MR', 'AM', 'RM']), validateRequest(offlineSyncSchema), dcrExecutionController.offlineSync);

export default router;
