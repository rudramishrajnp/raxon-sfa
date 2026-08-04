import { z } from 'zod';

export const registerTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.string().optional()
});

export const markReadSchema = z.object({
  notificationIds: z.array(z.string().uuid())
});

export const broadcastSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  type: z.string().min(1),
  targetRoles: z.array(z.string()).optional(),
  targetUserIds: z.array(z.string().uuid()).optional()
});
