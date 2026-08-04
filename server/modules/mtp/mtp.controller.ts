import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as mtpService from './mtp.service.js';

export const saveDraft = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await mtpService.saveDraft(userId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to save draft' });
  }
};

export const updateMtp = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { mtpId, ...data } = req.body;
    const result = await mtpService.updateMtp(userId, mtpId, data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update MTP' });
  }
};

export const submitMtp = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { mtpId } = req.body;
    const result = await mtpService.submitMtp(userId, mtpId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to submit MTP' });
  }
};

export const getCurrentMtp = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    
    const mtp = await mtpService.getCurrentMtp(userId, month, year);
    if (!mtp) {
      return res.status(404).json({ message: 'MTP not found for the specified month and year' });
    }
    res.status(200).json({ mtp });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch current MTP' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const history = await mtpService.getHistory(userId);
    res.status(200).json({ history });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch MTP history' });
  }
};

export const approveMtp = async (req: AuthRequest, res: Response) => {
  try {
    const managerId = req.user!.id;
    const { mtpId, remarks } = req.body;
    const result = await mtpService.reviewMtp(managerId, mtpId, 'APPROVED', remarks);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to approve MTP' });
  }
};

export const rejectMtp = async (req: AuthRequest, res: Response) => {
  try {
    const managerId = req.user!.id;
    const { mtpId, remarks } = req.body;
    
    if (!remarks) {
      return res.status(400).json({ error: 'Remarks are required for rejection' });
    }

    const result = await mtpService.reviewMtp(managerId, mtpId, 'REJECTED', remarks);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to reject MTP' });
  }
};

export const getStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    
    const status = await mtpService.getMtpStatus(userId, month, year);
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch MTP status' });
  }
};

export const getCalendar = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    
    const calendar = await mtpService.getCalendar(userId, month, year);
    res.status(200).json({ calendar });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch MTP calendar' });
  }
};
