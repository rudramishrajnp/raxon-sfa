import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { deviationSchema, jointWorkSchema } from './workplan.schema.js';
import * as workPlanController from './workplan.controller.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/work-plan/deviation:
 *   post:
 *     summary: Submit a deviation for today's work plan
 *     tags: [WorkPlan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - reason
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               customerId:
 *                 type: string
 *               customerName:
 *                 type: string
 *               reason:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Deviation submitted successfully
 *       500:
 *         description: Server error
 */
router.post('/deviation', validateRequest(deviationSchema), workPlanController.submitDeviation);

/**
 * @swagger
 * /api/work-plan/joint-work:
 *   post:
 *     summary: Submit a joint work request
 *     tags: [WorkPlan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - managerId
 *               - managerName
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               managerId:
 *                 type: string
 *                 format: uuid
 *               managerName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Joint work submitted successfully
 *       500:
 *         description: Server error
 */
router.post('/joint-work', validateRequest(jointWorkSchema), workPlanController.submitJointWork);

export default router;
