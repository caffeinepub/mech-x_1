import { useIsCallerAdmin } from './useQueries';

export function useUserRole() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  return {
    isAdmin: isAdmin || false,
    isLoading,
  };
}
