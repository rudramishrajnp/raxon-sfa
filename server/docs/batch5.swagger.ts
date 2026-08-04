/**
 * @swagger
 * /api/chat/group:
 *   post:
 *     summary: Create a chat group or 1-to-1 chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               isGroup:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Group created
 * 
 * /api/chat/message:
 *   post:
 *     summary: Send a chat message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: string
 *               content:
 *                 type: string
 *               mediaUrl:
 *                 type: string
 *               mediaType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 * 
 * /api/system/health:
 *   get:
 *     summary: Get system health
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System healthy
 */
