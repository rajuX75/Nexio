import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

vi.mock('@/lib/db', () => ({
  __esModule: true,
  db: mockDeep<PrismaClient>(),
}));
