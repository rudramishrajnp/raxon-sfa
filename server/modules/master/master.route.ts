import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { doctorRequestSchema, chemistRequestSchema } from './master.schema.js';
import * as masterController from './master.controller.js';

const router = Router();

router.use(authenticate);

router.get('/doctors', masterController.getDoctors);
router.get('/chemists', masterController.getChemists);
router.get('/products', masterController.getProducts);

/**
 * @swagger
 * /api/master/doctors/request:
 *   post:
 *     summary: Request to add a new doctor
 *     tags: [Master]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               class:
 *                 type: string
 *                 enum: [A, B, C]
 *               specialty:
 *                 type: string
 *               qualification:
 *                 type: string
 *               mobile:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Doctor request created successfully
 *       500:
 *         description: Server error
 */
router.post('/doctors/request', validateRequest(doctorRequestSchema), masterController.requestDoctor);

/**
 * @swagger
 * /api/master/chemists/request:
 *   post:
 *     summary: Request to add a new chemist
 *     tags: [Master]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               mobile:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Chemist request created successfully
 *       500:
 *         description: Server error
 */
router.post('/chemists/request', validateRequest(chemistRequestSchema), masterController.requestChemist);

export default router;
