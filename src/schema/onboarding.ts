import { z } from 'zod';

export const onboardingSchema = z.object({
  // Step 1: Personal Information
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  role: z.enum(['developer', 'designer', 'manager', 'student', 'entrepreneur', 'other'], {
    required_error: 'Please select a role',
  }),

  // Step 2: Preferences
  interests: z
    .array(
      z.enum([
        'mindMapping',
        'taskManagement',
        'teamCollaboration',
        'timeTracking',
        'noteTaking',
        'projectPlanning',
      ])
    )
    .min(1, 'Please select at least one interest'),
  experience: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select your experience level',
  }),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),

  // Step 3: Complete Setup
  avatar: z.string().url('Please provide a valid image URL').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  timezone: z.string().min(1, 'Please select your timezone'),
});

export type OnboardingSchemaType = z.infer<typeof onboardingSchema>;

// Individual step schemas for validation
export const step1Schema = onboardingSchema.pick({
  firstName: true,
  lastName: true,
  company: true,
  role: true,
});

export const step2Schema = onboardingSchema.pick({
  interests: true,
  experience: true,
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
});

export const step3Schema = onboardingSchema.pick({
  avatar: true,
  bio: true,
  timezone: true,
});
