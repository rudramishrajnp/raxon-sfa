import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as attendanceService from './attendance.service.js';

export const punchIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const deviceId = req.user!.deviceId;
    const { gps } = req.body;

    const result = await attendanceService.punchIn(userId, deviceId, gps);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Punch in failed' });
  }
};

export const punchOut = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const deviceId = req.user!.deviceId;
    const { gps } = req.body;

    const result = await attendanceService.punchOut(userId, deviceId, gps);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Punch out failed' });
  }
};

export const getTodayAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const attendance = await attendanceService.getTodayAttendance(userId);
    res.status(200).json({ attendance });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const history = await attendanceService.getAttendanceHistory(userId, limit, offset);
    res.status(200).json({ history });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const uploadBreadcrumbs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const deviceId = req.user!.deviceId;
    const { logs } = req.body;

    await attendanceService.uploadBreadcrumbs(userId, deviceId, logs);
    res.status(201).json({ message: 'Breadcrumbs uploaded successfully' });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to upload breadcrumbs' });
  }
};
