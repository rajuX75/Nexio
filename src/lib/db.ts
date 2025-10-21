import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined; // Use `| undefined` for stricter TypeScript
}

// In development, we use a global variable to prevent creating
// multiple instances of PrismaClient on hot reloads.
// In production, we instantiate it directly.

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export const db = prisma;
