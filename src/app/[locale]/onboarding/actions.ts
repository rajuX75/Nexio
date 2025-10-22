'use server';

import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { OnboardingSchemaType, onboardingSchema } from '@/schema/onboarding';
import { z } from 'zod';

export async function updateUserOnboarding(
  values: OnboardingSchemaType
): Promise<{ success: boolean; error?: string }> {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const validatedData = onboardingSchema.parse(values);

    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.firstName,
        surname: validatedData.lastName,
        image: validatedData.avatar,
        company: validatedData.company,
        role: validatedData.role,
        interests: validatedData.interests,
        experience: validatedData.experience,
        emailNotifications: validatedData.emailNotifications,
        pushNotifications: validatedData.pushNotifications,
        weeklyDigest: validatedData.weeklyDigest,
        bio: validatedData.bio,
        timezone: validatedData.timezone,
        completedOnboarding: true,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map((i) => i.message).join(', ') };
    }
    console.error('Failed to update onboarding data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
