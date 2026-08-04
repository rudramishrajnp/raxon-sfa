import { z } from 'zod';

export const applyLeaveSchema = z.object({
  type: z.enum(['CASUAL', 'SICK', 'EARNED']),
  startDate: z.string().date(),
  endDate: z.string().date(),
  reason: z.string().min(5)
});

export const reviewLeaveSchema = z.object({
  leaveId: z.string().uuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
  remarks: z.string().optional()
});
