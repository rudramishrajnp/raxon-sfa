import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as salesService from './sales.service.js';

export const addSecondarySales = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await salesService.addSecondarySales(userId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to add sales entry' });
  }
};

export const getMySales = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const sales = await salesService.getMySales(userId, limit, offset);
    res.status(200).json({ sales });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

export const getSalesSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    
    const summary = await salesService.getSalesSummary(userId, month, year);
    res.status(200).json({ summary });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sales summary' });
  }
};
