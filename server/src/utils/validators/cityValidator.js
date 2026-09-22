import { z } from 'zod';

export const createCitySchema = z.object({
  name: z
    .string({ required_error: 'City name is required' })
    .trim()
    .min(2, 'City name must be at least 2 characters')
    .max(60, 'City name cannot exceed 60 characters'),
  state: z.string().trim().optional().default(''),
  isPopular: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90).optional().default(0),
      lng: z.number().min(-180).max(180).optional().default(0),
    })
    .optional(),
});

export const updateCitySchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  state: z.string().trim().optional(),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional(),
    })
    .optional(),
});
