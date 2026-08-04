import { z } from 'zod';

export const dailyPlanSchema = z.object({
  date: z.string().date(),
  workType: z.string().min(1),
  locationType: z.string().min(1),
  doctorIds: z.array(z.string().uuid()).default([]),
  chemistIds: z.array(z.string().uuid()).default([]),
});

export const createDraftSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  dailyPlans: z.array(dailyPlanSchema),
});

export const updateMtpSchema = createDraftSchema.extend({
  mtpId: z.string().uuid(),
});

export const submitMtpSchema = z.object({
  mtpId: z.string().uuid(),
});

export const reviewMtpSchema = z.object({
  mtpId: z.string().uuid(),
  remarks: z.string().optional(),
});
