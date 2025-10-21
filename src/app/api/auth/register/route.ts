import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
// The import path is updated to match your new structure if necessary,
// otherwise, it defaults to the path provided in the user's latest context.
import { signUpSchema } from '@/schema/auth';
import { db } from '@/lib/db'; // Assuming db (PrismaClient) is exported from '@/lib/db'

/**
 * Handles POST requests for user registration (Sign Up).
 * This function validates input, checks for existing users by username and email,
 * hashes the password, and creates a new user record in the database.
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    // 1. Validate the request body using Zod schema
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      // Enhanced message for validation failure
      // Note: Removed redundant message concatenation and returned a simpler message.
      return NextResponse.json(
        { message: 'Validation Error: Please ensure all fields are filled out correctly.' },
        { status: 400 } // 400 Bad Request for validation errors
      );
    }

    const { email, password, username } = result.data;

    // 2. Check if a user with the provided username already exists
    const existingUsername = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      // Enhanced message for duplicate username
      return NextResponse.json(
        {
          message:
            'Registration Failed: This username is already taken. Please choose a different one.',
        },
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Check if a user with the provided email already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: email.toLowerCase().trim(), // Ensure email check is case-insensitive if unique constraint allows
      },
    });

    if (existingUser) {
      // Enhanced message for duplicate email
      return NextResponse.json(
        {
          message:
            'Registration Failed: An account with this email address already exists. Please sign in.',
        },
        { status: 409 } // 409 Conflict
      );
    }

    // 4. Hash the password
    // Note: Changed salt round to 12 for better security, as typically recommended.
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create the new user in the database
    const newUser = await db.user.create({
      data: {
        username: username,
        email: email.toLowerCase().trim(),
        hashedPassword,
      },
      select: {
        // Selecting specific fields to return, excluding the hash
        id: true,
        email: true,
        username: true,
        createdAt: true,
        name: true, // Assuming 'name' field exists, even if not explicitly provided in the data.
      },
    });

    // 6. Return success response
    return NextResponse.json(
      {
        message: 'Registration Successful! Account created.',
        user: newUser,
      },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error('Sign-Up Error:', error);

    // Enhanced generic error message for server/DB issues
    return NextResponse.json(
      {
        message:
          'Server Error: Unable to complete registration due to an unexpected issue. Please try again later.',
      },
      { status: 500 }
    );
  }
}
