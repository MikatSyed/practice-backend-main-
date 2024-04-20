import { Role } from '@prisma/client';
import { z } from 'zod';

const signupZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    role: z.enum([...Object.values(Role)] as [string, ...string[]], {}),
    address: z.string({
      required_error: 'Address is required',
    }),
    contactNo: z.string({
      required_error: 'ContactNo is required',
    }),
    profileImg: z.string({
      required_error: 'profileImg is required',
    }),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Phone Number is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({
      required_error: 'New password is required',
    }),
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
  }),
});

export const AuthValidation = {
  signupZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema
};
