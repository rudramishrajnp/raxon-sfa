import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { addSalesSchema } from './sales.schema.js';
import * as salesController from './sales.controller.js';

const router = Router();

router.use(authenticate);

router.post('/add', authorize(['MR', 'AM']), validateRequest(addSalesSchema), salesController.addSecondarySales);
router.get('/my-sales', authorize(['MR', 'AM']), salesController.getMySales);
router.get('/summary', authorize(['MR', 'AM', 'RM']), salesController.getSalesSummary);

export default router;
