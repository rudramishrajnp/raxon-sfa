import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as dashboardService from './dashboard.service.js';

export const getExecutiveDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const dashboard = await dashboardService.getExecutiveDashboard(userId, role);
    res.status(200).json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch executive dashboard' });
  }
};

export const getMrDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const dashboard = await dashboardService.getMrDashboard(userId);
    res.status(200).json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch MR dashboard' });
  }
};

export const getManagerDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const dashboard = await dashboardService.getManagerDashboard(userId);
    res.status(200).json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch manager dashboard' });
  }
};
