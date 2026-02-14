import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AsYouType, type CountryCode } from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return "U";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return 'N/A';
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPhoneNumber(value: string, countryCode: string): string {
  const rawInput = value.replace(/\D/g, "");
  const truncatedDetails = rawInput.slice(0, 15);

  const asYouType = new AsYouType(countryCode as CountryCode);
  return asYouType.input(truncatedDetails);
}
