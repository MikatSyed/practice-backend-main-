import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    categoryImg: z.string({
      required_error: 'Image URL is required',
    }),
  }),
});
const updateCategoryZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
