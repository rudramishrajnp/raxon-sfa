import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import * as analyticsController from './analytics.controller.js';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN', 'SUPER_ADMIN', 'RM', 'AM']));

router.get('/kpis/daily', analyticsController.getDailyKPIs);
router.get('/performance/product', analyticsController.getProductPerformance);

export default router;
