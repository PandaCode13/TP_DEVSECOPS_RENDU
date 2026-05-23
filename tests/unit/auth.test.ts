import jwt from 'jsonwebtoken';
import { describe, it, expect, vi } from 'vitest';
import { hashPassword, verifyPassword, signToken, verifyToken } from '@/lib/auth';

describe('auth.ts — password hashing', () => {
  it('hashes a password to a non-equal string', async () => {
    const hash = await hashPassword('Password123!');
    expect(hash).not.toBe('Password123!');
    expect(hash.length).toBeGreaterThan(20);
  });

  it('verifies a correct password', async () => {
    const hash = await hashPassword('MySecret42');
    expect(await verifyPassword('MySecret42', hash)).toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('MySecret42');
    expect(await verifyPassword('Wrong', hash)).toBe(false);
  });
});

describe('auth.ts — JWT', () => {
  it('signs and verifies a token', () => {
    const payload = { userId: 'abc', email: 'test@example.io', role: 'USER' };
    const token = signToken(payload);
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe('abc');
    expect(decoded?.email).toBe('test@example.io');
    expect(decoded?.role).toBe('USER');
  });

  it('returns null for a tampered token', () => {
    const token = signToken({ userId: 'x', email: 'y@example.com', role: 'USER' });
    expect(verifyToken(token + 'tampered')).toBeNull();
  });

  it('returns null for an invalid token format', () => {
    expect(verifyToken('not-a-token')).toBeNull();
  });

  it('returns null for an expired token', async () => {
    vi.resetModules();
    vi.stubEnv('JWT_SECRET', 'expired-token-test-secret');

    const { verifyToken: verifyTokenWithTestSecret } = await import('@/lib/auth');
    const token = jwt.sign(
      {
        userId: 'expired-user',
        email: 'expired@example.io',
        role: 'USER',
        exp: Math.floor(Date.now() / 1000) - 60,
      },
      'expired-token-test-secret'
    );

    expect(verifyTokenWithTestSecret(token)).toBeNull();
  });
});
