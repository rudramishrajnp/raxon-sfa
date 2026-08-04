import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).optional(),
  type: z.enum(['SAMPLE', 'GIFT', 'PROMOTIONAL'])
});

export const doctorSchema = z.object({
  name: z.string().min(1),
  class: z.enum(['A', 'B', 'C']),
  territoryId: z.string().uuid().optional()
});

export const chemistSchema = z.object({
  name: z.string().min(1),
  territoryId: z.string().uuid().optional()
});

export const doctorRequestSchema = z.object({
  name: z.string().min(1),
  class: z.enum(['A', 'B', 'C']).optional(),
  specialty: z.string().optional(),
  qualification: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const chemistRequestSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  mobile: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
