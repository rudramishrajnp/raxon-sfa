import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as expenseService from './expense.service.js';

export const submitExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const result = await expenseService.submitExpense(userId, role, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to submit expense' });
  }
};

export const getMyExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const expenses = await expenseService.getMyExpenses(userId, limit, offset);
    res.status(200).json({ expenses });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const uploadBill = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { expenseId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/bills/${req.file.filename}`;
    const fileType = req.file.mimetype;

    const result = await expenseService.uploadBill(userId, expenseId, fileUrl, fileType);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to upload bill' });
  }
};

export const getExpenseBills = async (req: AuthRequest, res: Response) => {
  try {
    const expenseId = req.params.expenseId;
    const bills = await expenseService.getExpenseBills(expenseId);
    res.status(200).json({ bills });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

export const reviewExpense = async (req: AuthRequest, res: Response) => {
  try {
    const managerId = req.user!.id;
    const { expenseId, status, remarks, ta, da, misc } = req.body;
    
    if (status === 'REJECTED' && !remarks) {
      return res.status(400).json({ error: 'Remarks are required for rejection' });
    }

    const adjustments = status === 'ADJUSTED' ? { ta, da, misc } : undefined;

    const result = await expenseService.reviewExpense(managerId, expenseId, status, remarks, adjustments);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to review expense' });
  }
};
