import { Role } from '@prisma/client';
import { z } from 'zod';

const userUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    role: z
      .enum([...Object.values(Role)] as [string, ...string[]], {})
      .optional(),
    address: z.string().optional(),
    contactNo: z.string().optional(),
    profileImg: z.string().optional(),
  }),
});

export const UserValidation = {
  userUpdateZodSchema,
};
