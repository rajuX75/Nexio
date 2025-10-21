import { z } from 'zod';

/**
 * Schema for validating the user registration (Sign Up) form data.
 */
export const signUpSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters long.'),
  email: z.string().email('Please enter a valid email address.'),
  // Enhanced message for better clarity and grammar
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

/**
 * Schema for validating the user login (Sign In) form data.
 */
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  // Enhanced message for better clarity and grammar
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  rememberMe: z.boolean().optional(),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
