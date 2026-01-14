'use client';

import React, {
  useState,
} from 'react';
import Link from 'next/link';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { resetPassword } from '@/lib/api';
import {
  Button,
  Input,
  Alert,
} from '@/components/ui';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';

const resetPasswordSchema =
  z
    .object(
      {
        password:
          z
            .string()
            .min(
              6,
              'Password must be at least 6 characters'
            ),
        confirmPassword:
          z.string(),
      }
    )
    .refine(
      (
        data
      ) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          "Passwords don't match",
        path: [
          'confirmPassword',
        ],
      }
    );

type ResetPasswordFormData =
  z.infer<
    typeof resetPasswordSchema
  >;

const ResetPasswordForm: React.FC =
  () => {
    const [
      showPassword,
      setShowPassword,
    ] =
      useState(
        false
      );
    const [
      showConfirmPassword,
      setShowConfirmPassword,
    ] =
      useState(
        false
      );
    const [
      error,
      setError,
    ] =
      useState<
        | string
        | null
      >(
        null
      );
    const [
      success,
      setSuccess,
    ] =
      useState(
        false
      );
    const [
      isLoading,
      setIsLoading,
    ] =
      useState(
        false
      );
    const router =
      useRouter();
    const searchParams =
      useSearchParams();
    const token =
      searchParams.get(
        'token'
      );

    const {
      register,
      handleSubmit,
      formState:
        {
          errors,
        },
    } = useForm<ResetPasswordFormData>(
      {
        resolver:
          zodResolver(
            resetPasswordSchema
          ),
      }
    );

    const onSubmit =
      async (
        data: ResetPasswordFormData
      ) => {
        if (
          !token
        ) {
          setError(
            'Invalid reset link. Please request a new password reset.'
          );
          return;
        }

        setError(
          null
        );
        setIsLoading(
          true
        );
        try {
          await resetPassword(
            {
              token,
              password:
                data.password,
            }
          );
          setSuccess(
            true
          );
        } catch (err: any) {
          setError(
            err
              .response
              ?.data
              ?.message ||
              'Password reset failed'
          );
        } finally {
          setIsLoading(
            false
          );
        }
      };

    if (
      !token
    ) {
      return (
        <div className="text-center space-y-4">
          <Alert variant="error">
            Invalid
            or
            missing
            reset
            token.
            Please
            request
            a
            new
            password
            reset.
          </Alert>
          <Link href="/forgot-password">
            <Button className="w-full">
              Request
              new
              reset
              link
            </Button>
          </Link>
        </div>
      );
    }

    if (
      success
    ) {
      return (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Password
            reset!
          </h3>
          <p className="text-gray-600">
            Your
            password
            has
            been
            successfully
            reset.
            You
            can
            now
            sign
            in
            with
            your
            new
            password.
          </p>
          <Button
            onClick={() =>
              router.push(
                '/login'
              )
            }
            className="w-full"
          >
            Sign
            in
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {error && (
          <Alert
            variant="error"
            onClose={() =>
              setError(
                null
              )
            }
          >
            {
              error
            }
          </Alert>
        )}

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-5"
        >
          <Input
            label="New password"
            type={
              showPassword
                ? 'text'
                : 'password'
            }
            placeholder="••••••••"
            leftIcon={
              <Lock className="w-5 h-5" />
            }
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
            error={
              errors
                .password
                ?.message
            }
            {...register(
              'password'
            )}
          />

          <Input
            label="Confirm new password"
            type={
              showConfirmPassword
                ? 'text'
                : 'password'
            }
            placeholder="••••••••"
            leftIcon={
              <Lock className="w-5 h-5" />
            }
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
            error={
              errors
                .confirmPassword
                ?.message
            }
            {...register(
              'confirmPassword'
            )}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={
              isLoading
            }
          >
            Reset
            password
          </Button>
        </form>
      </div>
    );
  };

export default ResetPasswordForm;
