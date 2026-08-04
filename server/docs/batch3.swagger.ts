/**
 * @swagger
 * /api/expense/submit:
 *   post:
 *     summary: Submit a daily expense report
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               locationType:
 *                 type: string
 *                 enum: [HQ, EX_HQ, OUTSTATION, TRANSIT]
 *               ta:
 *                 type: number
 *               da:
 *                 type: number
 *               misc:
 *                 type: number
 *               miscRemarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Expense submitted successfully
 * 
 * /api/expense/upload-bill:
 *   post:
 *     summary: Upload a bill receipt for an expense
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               expenseId:
 *                 type: string
 *               bill:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Bill uploaded successfully
 * 
 * /api/sales/add:
 *   post:
 *     summary: Add secondary sales entry
 *     tags: [Secondary Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entityType:
 *                 type: string
 *                 enum: [STOCKIST, RETAILER]
 *               entityId:
 *                 type: string
 *               productId:
 *                 type: string
 *               entryDate:
 *                 type: string
 *                 format: date
 *               quantity:
 *                 type: integer
 *               value:
 *                 type: number
 *     responses:
 *       201:
 *         description: Sales added successfully
 * 
 * /api/stock/update:
 *   post:
 *     summary: Update closing stock for a product
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *               openingStock:
 *                 type: integer
 *               closingStock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock updated successfully
 */
