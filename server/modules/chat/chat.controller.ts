import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as chatService from './chat.service.js';

export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, memberIds, isGroup } = req.body;
    const result = await chatService.createGroup(userId, name, memberIds, isGroup);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create group' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { groupId, content, mediaUrl, mediaType } = req.body;
    const result = await chatService.sendMessage(userId, groupId, content, mediaUrl, mediaType);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to send message' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { messageIds } = req.body;
    const result = await chatService.markAsRead(userId, messageIds);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to mark as read' });
  }
};

export const getMyGroups = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const groups = await chatService.getMyGroups(userId);
    res.status(200).json({ groups });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const groupId = req.params.groupId;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const messages = await chatService.getMessages(userId, groupId, limit, offset);
    res.status(200).json({ messages });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
