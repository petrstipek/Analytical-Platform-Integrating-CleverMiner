import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/modules/auth/api/auth.api';
import { storage } from '@/modules/auth/utils/storage';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 60_000,
    enabled: !!storage.getToken(),
  });
}
