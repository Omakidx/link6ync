"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPassword } from "@/lib/api";
import { Button, Alert } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { GoVerified } from "react-icons/go";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [countdown, setCountdown] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Countdown timer effect
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [success, countdown]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      await forgotPassword(data);
      setSubmittedEmail(data.email);
      setSuccess(true);
    } catch (err: any) {
      // Always show success to prevent email enumeration
      setSubmittedEmail(data.email);
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail || isResending || countdown > 0) return;
    setIsResending(true);
    try {
      await forgotPassword({ email: submittedEmail });
      setCountdown(60); // Reset countdown after successful resend
    } catch (err: any) {
      // Silently handle error
      setCountdown(60); // Reset countdown even on error
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmailApp = () => {
    window.location.href = "mailto:";
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <GoVerified className="w-16 h-16 text-primary-600" />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-sm text-gray-600">
              We sent a password reset link to
              <br />
              {submittedEmail}
            </p>
          </div>

          {/* Open Email App Button */}
          <Button onClick={handleOpenEmailApp} className="w-full py-4 text-base font-semibold mb-4" size="lg">
            Open email app
          </Button>

          {/* Resend Link */}
          <p className="text-center text-sm text-gray-600 mb-6">
            Didn&apos;t receive the email?{" "}
            {countdown > 0 ? (
              <span className="font-medium text-gray-500">Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Click here to resend"}
              </button>
            )}
          </p>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Enter your registered email address and we&apos;ll send you a
            <br />
            secure link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <div>
            <input
              type="email"
              placeholder="youremail@mail.host"
              className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full py-4 text-base font-semibold" size="lg" isLoading={isLoading}>
            Send Reset Link
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
