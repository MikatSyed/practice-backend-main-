import { z } from 'zod';

const createServiceZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    location: z.string({
      required_error: 'Location is required',
    }),
    price: z
      .number({
        required_error: 'Price is required',
      })
      .nonnegative(),
    serviceImg: z.string({
      required_error: 'Image URL is required',
    }),
    duration: z.string({
      required_error: 'Duration is required',
    }),
    categoryId: z.string({
      required_error: 'Category ID is required',
    }),
  }),
});

const updateServiceZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    price: z.number().optional(),
    image: z.string().optional(),
    duration: z.string().optional(),
    categoryId: z.string().optional(),
  }),
});

export const ServiceValidation = {
  createServiceZodSchema,
  updateServiceZodSchema,
};
