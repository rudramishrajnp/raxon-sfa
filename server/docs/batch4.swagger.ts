/**
 * @swagger
 * /api/dashboard/executive:
 *   get:
 *     summary: Get Executive Dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 * 
 * /api/reports/dcr/daily:
 *   get:
 *     summary: Get Daily DCR Report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *       - in: query
 *         name: export
 *         schema:
 *           type: string
 *           enum: [json, csv, excel, pdf]
 *     responses:
 *       200:
 *         description: DCR Report data
 * 
 * /api/notifications/broadcast:
 *   post:
 *     summary: Broadcast a message to users
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Broadcast sent
 * 
 * /api/analytics/kpis/daily:
 *   get:
 *     summary: Get Daily KPIs
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daily KPIs
 */
