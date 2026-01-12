"use client";

import { useAuthStore } from "@/store/authStore";
import React from 'react';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-gray-500">Overview of your account performance</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Dashboard content placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 h-[400px] flex items-center justify-center">
        Dashboard Overview Content
      </div>
    </div>
  );
}
