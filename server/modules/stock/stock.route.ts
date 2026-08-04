import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { updateStockSchema } from './stock.schema.js';
import * as stockController from './stock.controller.js';

const router = Router();

router.use(authenticate);

router.post('/update', authorize(['MR', 'AM']), validateRequest(updateStockSchema), stockController.updateStock);
router.get('/my-stocks', authorize(['MR', 'AM']), stockController.getMyStocks);

export default router;
