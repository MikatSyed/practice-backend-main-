import { z } from 'zod';
const reviewZodSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    serviceId: z.string().uuid(),
    rating: z.number().min(1).max(5), // Assuming rating is between 0 and 5
    comment: z.string(),
  }),
});

export const ReviewValidation = {
  reviewZodSchema,
};
