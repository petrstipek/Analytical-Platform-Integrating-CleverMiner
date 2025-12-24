import { apiClient } from '@/lib/api-client';
import type { Me } from '@/modules/auth/api/domain/user.types';

export async function getMe(): Promise<Me> {
  const res = await apiClient.get('/users/me/');
  return res.data;
}

export async function login(payload: { email: string; password: string }) {
  const res = await apiClient.post('/auth/login/', payload);
  return res.data;
}

export async function logout() {
  await apiClient.post('/auth/logout/');
}
