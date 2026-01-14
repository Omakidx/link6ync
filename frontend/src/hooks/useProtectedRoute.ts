import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

interface UseProtectedRouteOptions {
  requiredRole?:
    | 'user'
    | 'admin';
  redirectTo?: string;
}

export function useProtectedRoute(
  options: UseProtectedRouteOptions = {}
) {
  const {
    requiredRole,
    redirectTo = '/login',
  } =
    options;
  const {
    isAuthenticated,
    isInitialized,
    user,
  } =
    useAuthStore();
  const router =
    useRouter();

  useEffect(() => {
    if (
      !isInitialized
    )
      return;

    if (
      !isAuthenticated
    ) {
      router.push(
        redirectTo
      );
      return;
    }

    if (
      requiredRole &&
      user?.role !==
        requiredRole
    ) {
      router.push(
        '/dashboard'
      );
      return;
    }
  }, [
    isAuthenticated,
    isInitialized,
    user,
    requiredRole,
    redirectTo,
    router,
  ]);

  return {
    isAuthenticated,
    isInitialized,
    user,
    isAuthorized:
      isAuthenticated &&
      (!requiredRole ||
        user?.role ===
          requiredRole),
  };
}

export default useProtectedRoute;
