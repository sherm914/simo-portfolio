'use server';

import { verifyPassword, setAuthCookie, clearAuthCookie } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password') as string;

  if (!password) {
    return { error: 'Password required' };
  }

  if (!verifyPassword(password)) {
    return { error: 'Invalid password' };
  }

  await setAuthCookie();
  redirect('/admin');
}

export async function logoutAdmin() {
  await clearAuthCookie();
  redirect('/admin/login');
}
