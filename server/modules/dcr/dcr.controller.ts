import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as dcrService from './dcr.service.js';

export const saveDraft = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await dcrService.saveDraft(userId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to save DCR draft' });
  }
};

export const submitDcr = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { date } = req.body;
    const result = await dcrService.submitDcr(userId, date);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to submit DCR' });
  }
};

export const getDcr = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const date = req.query.date as string;
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const dcr = await dcrService.getDcr(userId, date);
    if (!dcr) {
      return res.status(404).json({ message: 'DCR not found for this date' });
    }
    res.status(200).json({ dcr });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch DCR' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const history = await dcrService.getDcrHistory(userId, limit, offset);
    res.status(200).json({ history });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch DCR history' });
  }
};
