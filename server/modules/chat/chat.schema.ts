import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().optional(),
  memberIds: z.array(z.string().uuid()).min(1),
  isGroup: z.boolean().default(false)
});

export const sendMessageSchema = z.object({
  groupId: z.string().uuid(),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.string().optional()
}).refine(data => data.content || data.mediaUrl, {
  message: "Either content or mediaUrl is required"
});

export const readReceiptSchema = z.object({
  messageIds: z.array(z.string().uuid()).min(1)
});
