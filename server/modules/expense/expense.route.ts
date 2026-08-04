import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { submitExpenseSchema, reviewExpenseSchema } from './expense.schema.js';
import * as expenseController from './expense.controller.js';

// Setup Multer for bill uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/bills';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});

const router = Router();

router.use(authenticate);

// Employee routes
router.post('/submit', authorize(['MR', 'AM', 'RM']), validateRequest(submitExpenseSchema), expenseController.submitExpense);
router.get('/my-expenses', authorize(['MR', 'AM', 'RM']), expenseController.getMyExpenses);
router.post('/upload-bill', authorize(['MR', 'AM', 'RM']), upload.single('bill'), expenseController.uploadBill);
router.get('/:expenseId/bills', expenseController.getExpenseBills);

// Manager routes
router.post('/review', authorize(['AM', 'RM', 'ADMIN', 'SUPER_ADMIN']), validateRequest(reviewExpenseSchema), expenseController.reviewExpense);

export default router;
