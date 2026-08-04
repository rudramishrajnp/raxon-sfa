import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as workPlanService from './workplan.service.js';

export const submitDeviation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = await workPlanService.submitDeviation(userId, req.body);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit deviation' });
  }
};

export const submitJointWork = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = await workPlanService.submitJointWork(userId, req.body);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit joint work' });
  }
};
