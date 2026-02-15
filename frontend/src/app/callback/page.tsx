"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { setAccessToken, getCurrentUser, verify2FALogin } from "@/lib/api";
import {
  LoadingScreen,
  Alert,
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { AuthLayout } from "@/components/layout";
import { KeyRound, Shield } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const errorParam = searchParams.get("error");
      const requires2faParam = searchParams.get("requires2fa");
      const tempTokenParam = searchParams.get("tempToken");
      const provider = searchParams.get("provider");

      // Store the provider in localStorage for "Last used" feature
      if (provider && (provider === "google" || provider === "github")) {
        localStorage.setItem("lastAuthMethod", provider);
      }

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setIsLoading(false);
        return;
      }

      // Check if 2FA is required
      if (requires2faParam === "true" && tempTokenParam) {
        setRequires2FA(true);
        setTempToken(tempTokenParam);
        setIsLoading(false);
        return;
      }

      if (!token) {
        setError("No authentication token received");
        setIsLoading(false);
        return;
      }

      try {
        // Store the access token
        setAccessToken(token);

        // Fetch the user data
        const { user } = await getCurrentUser();

        // Update the auth store
        setUser(user);

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setError(err?.response?.data?.message || "Authentication failed. Please try again.");
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempToken || twoFactorCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await verify2FALogin(tempToken, twoFactorCode);

      // Update the auth store with user data
      setUser(response.user);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("2FA verification error:", err);
      setError(err?.response?.data?.message || "Invalid verification code. Please try again.");
      setIsVerifying(false);
    }
  };

  // Show 2FA verification form
  if (requires2FA) {
    return (
      <AuthLayout title="Two-Factor Authentication" subtitle="Enter the code from your authenticator app">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <CardTitle>Verify Your Identity</CardTitle>
            <CardDescription>Enter the 6-digit code from your authenticator app to complete sign in</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handle2FAVerify} className="space-y-6">
              <Input
                label="Verification Code"
                type="text"
                placeholder="Enter 6-digit code"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                autoFocus
                leftIcon={<KeyRound className="w-5 h-5" />}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isVerifying}
                disabled={twoFactorCode.length !== 6}
              >
                Verify & Sign In
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel and go back to login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
          <div className="text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  return <LoadingScreen message="Completing sign in..." />;
}
