import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const circleSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className={cn("relative animate-spin-scale", sizes[size], className)}>
      <div className={cn("absolute top-0 left-0 rounded-full bg-primary-600", circleSizes[size])} />
      <div className={cn("absolute top-0 right-0 rounded-full bg-primary-600", circleSizes[size])} />
      <div className={cn("absolute bottom-0 left-0 rounded-full bg-primary-600", circleSizes[size])} />
      <div className={cn("absolute bottom-0 right-0 rounded-full bg-primary-600", circleSizes[size])} />
    </div>
  );
};

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="md" className="mx-auto mb-4" />
      </div>
    </div>
  );
};

export default Spinner;
