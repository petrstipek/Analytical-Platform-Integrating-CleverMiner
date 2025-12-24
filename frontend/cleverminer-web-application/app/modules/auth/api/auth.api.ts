import { apiClient } from '@/lib/api-client';
import type { Me } from '@/modules/auth/api/domain/user.types';

export async function getMe(): Promise<Me> {
  const res = await apiClient.get('/api/users/me/');
  return res.data;
}
