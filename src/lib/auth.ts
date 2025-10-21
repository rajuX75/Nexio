import { PrismaAdapter } from '@auth/prisma-adapter';
import * as bcrypt from 'bcrypt';
import { getServerSession, NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { db } from './db';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/auth/error',
    signIn: 'signIn',
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'username  ', type: 'text', placeholder: 'jhondoe' },
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password', placeholder: '••••••••' },
      },
      async authorize(credentials, req) {
        // Validate input presence
        if (!credentials?.email || !credentials?.password) {
          throw new Error(
            'Authentication failed: Email and password are required. Please provide both credentials to continue.'
          );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
          throw new Error('Invalid email format: Please enter a valid email address.');
        }

        // Validate password length
        if (credentials.password.length < 8) {
          throw new Error('Invalid password: Password must be at least 8 characters long.');
        }

        try {
          // Attempt to find user
          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          // Check if user exists and has password set
          if (!user || !user?.hashedPassword) {
            throw new Error(
              'Authentication failed: No account found with this email address. Please check your credentials or sign up for a new account.'
            );
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword);

          if (!isPasswordValid) {
            throw new Error(
              'Authentication failed: The password you entered is incorrect. Please try again or use the "Forgot Password" option to reset it.'
            );
          }

          // Return user on successful authentication
          return user;
        } catch (error) {
          // Handle database or bcrypt errors
          if (error instanceof Error && error.message.startsWith('Authentication failed')) {
            throw error;
          }
          console.error('Authentication error:', error);
          throw new Error(
            'Authentication error: Unable to complete sign in. Please try again later or contact support if the issue persists.'
          );
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.image = token.email;
        session.user.username = token.username;
      }
      const user = await db.user.findUnique({
        where: {
          id: token.id,
        },
      });
      if (user) {
        session.user.image = user.image;
        session.user.username = user.username?.toLowerCase().replace(/\s+/g, '') || null;
      }
      console.log('SESSION: ', session);
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!dbUser) {
        token.id = user?.id;
        return token;
      }
      return {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        picture: dbUser.image,
      };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
