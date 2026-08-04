import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as leaveService from './leave.service.js';

export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await leaveService.applyLeave(userId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to apply leave' });
  }
};

export const getMyLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const history = await leaveService.getMyLeaves(userId, limit, offset);
    res.status(200).json({ history });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
};

export const getMyBalances = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    
    const balances = await leaveService.getMyBalances(userId, year);
    res.status(200).json({ balances });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch leave balances' });
  }
};

export const reviewLeave = async (req: AuthRequest, res: Response) => {
  try {
    const managerId = req.user!.id;
    const { leaveId, status, remarks } = req.body;
    
    if (status === 'REJECTED' && !remarks) {
      return res.status(400).json({ error: 'Remarks are required for rejection' });
    }

    const result = await leaveService.reviewLeave(managerId, leaveId, status, remarks);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to review leave' });
  }
};
