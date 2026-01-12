"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store";
import { LoadingScreen } from "@/components/ui";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/account-type",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/callback",
];

// Routes that require admin role
const adminRoutes = ["/admin"];

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading, isInitialized, initialize, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isInitialized) return;

    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
    const isAdminRoute = adminRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

    // Redirect to login if not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    // Redirect to dashboard if authenticated and trying to access auth pages
    const authPages = ["/login", "/register", "/account-type", "/forgot-password", "/reset-password", "/verify-email"];
    if (isAuthenticated && authPages.some(page => pathname === page || pathname.startsWith(page + "/")) && pathname !== "/callback") {
      router.replace("/dashboard");
      return;
    }

    // Redirect to dashboard if not admin and trying to access admin routes
    if (isAuthenticated && isAdminRoute && user?.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
  }, [isAuthenticated, isInitialized, pathname, router, user]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return <LoadingScreen message="Loading..." />;
  }

  return <>{children}</>;
}

export default AuthProvider;
