import { z } from 'zod';

export const updateStockSchema = z.object({
  productId: z.string().uuid(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  openingStock: z.number().int().min(0).optional(),
  closingStock: z.number().int().min(0).optional()
});
