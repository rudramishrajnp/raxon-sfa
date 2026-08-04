/**
 * @swagger
 * /api/dcr/check-in:
 *   post:
 *     summary: Check-in to a doctor call with geofencing validation
 *     tags: [DCR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dcrId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               timestamp:
 *                 type: string
 *     responses:
 *       201:
 *         description: Check-in successful
 * /api/dcr/check-out:
 *   post:
 *     summary: Check-out from a doctor call with product details
 *     tags: [DCR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               callId:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               timestamp:
 *                 type: string
 *               inChamberTime:
 *                 type: integer
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Check-out successful
 * /api/dcr/offline-sync:
 *   post:
 *     summary: Sync offline DCR calls
 *     tags: [DCR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dcrId:
 *                 type: string
 *               calls:
 *                 type: array
 *     responses:
 *       200:
 *         description: Sync successful
 */
