import { z } from 'zod';

export const deviationSchema = z.object({
  date: z.string().date(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  reason: z.string().min(1),
  remarks: z.string().optional(),
});

export const jointWorkSchema = z.object({
  date: z.string().date(),
  managerId: z.string().uuid(),
  managerName: z.string().min(1),
});
