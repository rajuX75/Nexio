'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

/**
 * AuthProvider wraps the application with NextAuth's SessionProvider.
 * This makes the session data accessible to all client components via the useSession hook.
 *
 * @param children The React nodes (components) to be wrapped.
 * @returns A SessionProvider component wrapping the children.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
