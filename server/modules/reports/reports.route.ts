import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import * as reportsController from './reports.controller.js';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN', 'SUPER_ADMIN', 'RM', 'AM']));

router.get('/dcr/daily', reportsController.getDailyDCRReport);
router.get('/attendance', reportsController.getAttendanceReport);
router.get('/expense', reportsController.getExpenseReport);
router.get('/sales', reportsController.getSecondarySalesReport);
router.get('/stock', reportsController.getStockReport);

export default router;
