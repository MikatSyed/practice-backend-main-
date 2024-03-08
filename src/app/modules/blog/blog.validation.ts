import { z } from 'zod';

const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'question is required',
    }),
    content: z.string({
      required_error: 'answer is required',
    }),
  }),
});
const updateBlogZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'question is required',
      })
      .optional(),
    content: z
      .string({
        required_error: 'answer is required',
      })
      .optional(),
  }),
});

export const BlogValidation = {
  createBlogZodSchema,
  updateBlogZodSchema,
};
