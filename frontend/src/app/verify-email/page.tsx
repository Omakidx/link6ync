"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmail } from "@/lib/api";
import { Button } from "@/components/ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import { GoVerified } from "react-icons/go";
import { HiOutlineXCircle } from "react-icons/hi2";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing");
        return;
      }

      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Email verification failed");
      }
    };

    verify();
  }, [token]);

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email</h1>
            <p className="text-sm text-gray-600">Please wait while we verify your email address...</p>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <GoVerified className="w-16 h-16 text-primary-600" />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-sm text-gray-600">
              Your email has been successfully verified.
              <br />
              You can now sign in to your account.
            </p>
          </div>

          {/* Continue Button */}
          <Link href="/login">
            <Button className="w-full py-4 text-base font-semibold mb-6" size="lg">
              Continue to Sign In
            </Button>
          </Link>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <HiOutlineXCircle className="w-16 h-16 text-red-500" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-sm text-gray-600">
            {message}
            <br />
            Please try again or request a new verification link.
          </p>
        </div>

        {/* Try Again Button */}
        <Link href="/login">
          <Button className="w-full py-4 text-base font-semibold mb-6" size="lg">
            Back to Sign In
          </Button>
        </Link>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
