import { z } from 'zod';

export const submitExpenseSchema = z.object({
  date: z.string().date(),
  locationType: z.enum(['HQ', 'EX_HQ', 'OUTSTATION', 'TRANSIT']),
  ta: z.number().min(0).default(0),
  da: z.number().min(0).default(0),
  misc: z.number().min(0).default(0),
  miscRemarks: z.string().optional()
});

export const reviewExpenseSchema = z.object({
  expenseId: z.string().uuid(),
  status: z.enum(['APPROVED', 'REJECTED', 'ADJUSTED']),
  ta: z.number().min(0).optional(),
  da: z.number().min(0).optional(),
  misc: z.number().min(0).optional(),
  remarks: z.string().optional()
});
