import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as analyticsService from './analytics.service.js';

export const getDailyKPIs = async (req: AuthRequest, res: Response) => {
  try {
    const date = req.query.date as string || new Date().toISOString().split('T')[0];
    const kpis = await analyticsService.getDailyKPIs(date);
    res.status(200).json(kpis);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
};

export const getProductPerformance = async (req: AuthRequest, res: Response) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await analyticsService.getProductPerformance(month, year);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch product performance' });
  }
};
