import { Request, Response } from 'express';
import * as authService from './auth.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, deviceId, deviceName } = req.body;
    const result = await authService.login(email, password, deviceId, deviceName);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Token refresh failed' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const deviceId = req.user?.deviceId;
    
    if (userId && deviceId) {
      await authService.logout(userId, deviceId);
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const user = await authService.getUserById(userId);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: 'User not found' });
  }
};
