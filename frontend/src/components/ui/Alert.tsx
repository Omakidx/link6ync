import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Info } from "lucide-react";
import { GoVerified, GoUnverified } from "react-icons/go";

interface AlertProps {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ variant = "info", title, children, onClose, className }) => {
  const variants = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: <GoVerified className="w-5 h-5 text-green-500" />,
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: <GoUnverified className="w-5 h-5 text-red-500" />,
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  return (
    <div
      className={cn("flex items-start gap-3 p-4 rounded-lg border", variants[variant].container, className)}
      role="alert"
    >
      <div className="flex-shrink-0">{variants[variant].icon}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-medium mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export default Alert;
