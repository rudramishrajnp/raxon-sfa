import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as dcrExecutionService from './dcr.execution.service.js';

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await dcrExecutionService.checkIn(userId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Check-in failed' });
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await dcrExecutionService.checkOut(userId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Check-out failed' });
  }
};

export const offlineSync = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await dcrExecutionService.offlineSync(userId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Offline sync failed' });
  }
};
