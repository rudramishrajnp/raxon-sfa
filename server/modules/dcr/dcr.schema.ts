import { z } from 'zod';

export const sampleGivenSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive()
});

export const doctorCallSchema = z.object({
  doctorId: z.string().uuid(),
  callTime: z.string().datetime(),
  inChamberTime: z.number().int().optional(),
  remarks: z.string().optional(),
  samples: z.array(sampleGivenSchema).optional()
});

export const saveDcrSchema = z.object({
  date: z.string().date(),
  workType: z.string().min(1),
  remarks: z.string().optional(),
  doctorCalls: z.array(doctorCallSchema).default([])
});

export const submitDcrSchema = z.object({
  date: z.string().date()
});

export const checkInSchema = z.object({
  dcrId: z.string().uuid(),
  doctorId: z.string().uuid(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timestamp: z.string().datetime()
});

export const checkOutSchema = z.object({
  callId: z.string().uuid(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timestamp: z.string().datetime(),
  inChamberTime: z.number().int().optional(),
  feedback: z.string().optional(),
  samples: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive()
  })).optional(),
  orders: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    amount: z.number().optional()
  })).optional(),
  prescriptions: z.array(z.object({
    productId: z.string().uuid(),
    prescriptionCount: z.number().int().positive()
  })).optional()
});

export const offlineSyncSchema = z.object({
  dcrId: z.string().uuid(),
  calls: z.array(z.object({
    doctorId: z.string().uuid(),
    checkInTime: z.string().datetime(),
    checkOutTime: z.string().datetime(),
    checkInLat: z.number(),
    checkInLng: z.number(),
    checkOutLat: z.number(),
    checkOutLng: z.number(),
    inChamberTime: z.number().int().optional(),
    feedback: z.string().optional(),
    samples: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive()
    })).optional(),
    orders: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      amount: z.number().optional()
    })).optional(),
    prescriptions: z.array(z.object({
      productId: z.string().uuid(),
      prescriptionCount: z.number().int().positive()
    })).optional()
  }))
});
