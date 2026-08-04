import { z } from 'zod';

export const addSalesSchema = z.object({
  entityType: z.enum(['STOCKIST', 'RETAILER']),
  entityId: z.string().uuid(),
  productId: z.string().uuid(),
  entryDate: z.string().date(),
  quantity: z.number().int().positive(),
  value: z.number().positive()
});
