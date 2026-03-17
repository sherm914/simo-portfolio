import crypto from 'crypto';
import { cookies } from 'next/headers';

// Hash the admin password using PBKDF2
const ADMIN_PASSWORD = 'Nuj@bes55!7';
const SALT = 'simo-portfolio-admin-salt-2024';
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const ALGORITHM = 'sha256';

export function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, SALT, ITERATIONS, KEY_LENGTH, ALGORITHM)
    .toString('hex');
}

export function verifyPassword(password: string): boolean {
  const hashedInput = hashPassword(password);
  const hashedStored = hashPassword(ADMIN_PASSWORD);
  return hashedInput === hashedStored;
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set('admin-auth', 'authenticated', {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-auth');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin-auth')?.value === 'authenticated';
}
