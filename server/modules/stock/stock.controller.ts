import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as stockService from './stock.service.js';

export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await stockService.updateStock(userId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update stock' });
  }
};

export const getMyStocks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    
    const stocks = await stockService.getMyStocks(userId, month, year);
    res.status(200).json({ stocks });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
};
