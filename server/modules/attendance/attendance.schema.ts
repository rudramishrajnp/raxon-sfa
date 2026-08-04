import { z } from 'zod';

export const gpsLogSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  speed: z.number().optional(),
  batteryPercentage: z.number().min(0).max(100).optional(),
  timestamp: z.string().datetime(),
});

export const punchInSchema = z.object({
  gps: gpsLogSchema,
});

export const punchOutSchema = z.object({
  gps: gpsLogSchema,
});

export const breadcrumbSchema = z.object({
  logs: z.array(gpsLogSchema).max(100),
});
