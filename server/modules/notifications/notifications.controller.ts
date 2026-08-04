import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as notificationsService from './notifications.service.js';

export const registerToken = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { token, platform } = req.body;
    const result = await notificationsService.registerToken(userId, token, platform);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to register token' });
  }
};

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const notifications = await notificationsService.getMyNotifications(userId, limit, offset);
    res.status(200).json({ notifications });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const count = await notificationsService.getUnreadCount(userId);
    res.status(200).json({ count });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { notificationIds } = req.body;
    const result = await notificationsService.markAsRead(userId, notificationIds);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to mark as read' });
  }
};

export const broadcast = async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, type, targetRoles, targetUserIds } = req.body;
    const result = await notificationsService.broadcast(title, body, type, targetRoles, targetUserIds);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to send broadcast' });
  }
};
