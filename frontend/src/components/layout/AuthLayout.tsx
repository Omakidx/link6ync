'use client';

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<
  AuthLayoutProps
> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="flex justify-center"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-10 h-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">
              AuthApp
            </span>
          </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {
            title
          }
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {
              subtitle
            }
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {
            children
          }
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
