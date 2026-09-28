'use client';
import { useQuery } from '@tanstack/react-query';
import { useUserFromStorage } from './user.context';
import { getCapabilities } from '@/lib/api/access-api';
export function useCapabilities(companyId, ready = true) {
  const { user } = useUserFromStorage();
  return useQuery({
    queryKey: ['capabilities', user.id, companyId || user.companyId],
    queryFn: ({ signal }) => getCapabilities({ companyId, signal }),
    enabled: ready && !!user.id,
    retry: false, staleTime: 0, refetchOnWindowFocus: true,
  });
}
