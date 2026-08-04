import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { punchInSchema, punchOutSchema, breadcrumbSchema } from './attendance.schema.js';
import * as attendanceController from './attendance.controller.js';

const router = Router();

// All attendance routes require authentication
router.use(authenticate);

router.post('/punch-in', validateRequest(punchInSchema), attendanceController.punchIn);
router.post('/punch-out', validateRequest(punchOutSchema), attendanceController.punchOut);
router.get('/today', attendanceController.getTodayAttendance);
router.get('/history', attendanceController.getHistory);
router.post('/breadcrumbs', validateRequest(breadcrumbSchema), attendanceController.uploadBreadcrumbs);

export default router;
