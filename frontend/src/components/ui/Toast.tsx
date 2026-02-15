"use client";

import React, { useEffect, useState } from "react";
import { Info, AlertTriangle } from "lucide-react";
import { useToastStore, ToastType } from "@/store/toastStore";
import { GoVerified, GoUnverified } from "react-icons/go";

import { cn } from "@/lib/utils";

const toastStyles: Record<ToastType, { bg: string; border: string; icon: string; iconBg: string }> = {
  success: {
    bg: "bg-white",
    border: "border-green-200",
    icon: "text-green-500",
    iconBg: "bg-green-50",
  },
  error: {
    bg: "bg-white",
    border: "border-red-200",
    icon: "text-red-500",
    iconBg: "bg-red-50",
  },
  info: {
    bg: "bg-white",
    border: "border-primary-200",
    icon: "text-primary-600",
    iconBg: "bg-primary-50",
  },
  warning: {
    bg: "bg-white",
    border: "border-amber-200",
    icon: "text-amber-500",
    iconBg: "bg-amber-50",
  },
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <GoVerified className="w-5 h-5" />,
  error: <GoUnverified className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
};

interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
  onRemove: (id: string) => void;
}

function ToastItem({ id, type, message, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const styles = toastStyles[type];

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(id);
    }, 200);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 w-80 p-4 rounded-2xl border shadow-lg transition-all duration-200 ease-out",
        styles.bg,
        styles.border,
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      {/* Icon */}
      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", styles.iconBg)}>
        <span className={styles.icon}>{toastIcons[type]}</span>
      </div>

      {/* Message */}
      <p className="flex-1 text-sm text-gray-700 font-medium pt-1">{message}</p>

      {/* Close Button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 -mt-1 -mr-1"
      ></button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} type={toast.type} message={toast.message} onRemove={removeToast} />
      ))}
    </div>
  );
}

export default ToastContainer;
