import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { db } from '@/lib/db';
import { signUpSchema } from '@/schema/auth';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt');

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should register a new user successfully', async () => {
    const mockRequest = {
      json: async () => ({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      }),
    } as Request;

    (db.user.findUnique as any).mockResolvedValue(null);
    (bcrypt.hash as any).mockResolvedValue('hashedpassword');
    (db.user.create as any).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      createdAt: new Date(),
      name: null,
    });

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.message).toBe('Registration Successful! Account created.');
    expect(body.user.email).toBe('test@example.com');
  });

  it('should return 409 if username is already taken', async () => {
    const mockRequest = {
      json: async () => ({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      }),
    } as Request;

    (db.user.findUnique as any).mockResolvedValue({ id: '1' });

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.message).toBe(
      'Registration Failed: This username is already taken. Please choose a different one.'
    );
  });

  it('should return 409 if email is already taken', async () => {
    const mockRequest = {
      json: async () => ({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      }),
    } as Request;

    (db.user.findUnique as any).mockResolvedValueOnce(null).mockResolvedValueOnce({ id: '1' });

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.message).toBe(
      'Registration Failed: An account with this email address already exists. Please sign in.'
    );
  });

  it('should return 400 for invalid input', async () => {
    const mockRequest = {
      json: async () => ({
        email: 'invalid-email',
        password: 'short',
        username: 'tu',
      }),
    } as Request;

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toContain('Validation Error');
  });
});
