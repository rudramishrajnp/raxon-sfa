import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import * as dashboardController from './dashboard.controller.js';

const router = Router();

router.use(authenticate);

// Executive dashboard requires higher roles usually, but we allow AM/RM/ADMIN
router.get('/executive', authorize(['AM', 'RM', 'ADMIN', 'SUPER_ADMIN']), dashboardController.getExecutiveDashboard);
router.get('/mr', authorize(['MR', 'AM', 'RM', 'ADMIN', 'SUPER_ADMIN']), dashboardController.getMrDashboard);
router.get('/manager', authorize(['AM', 'RM', 'ADMIN', 'SUPER_ADMIN']), dashboardController.getManagerDashboard);

export default router;
