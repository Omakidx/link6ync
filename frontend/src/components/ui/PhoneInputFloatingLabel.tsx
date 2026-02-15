"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { countries, type Country } from "@/lib/countries";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PhoneInputFloatingLabelProps {
  className?: string;
  defaultCountry?: string;
  label?: string;
  showLabel?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (data: { country: Country; phoneNumber: string; fullNumber: string }) => void;
}

export default function PhoneInputFloatingLabel({
  className,
  defaultCountry = "FR",
  label = "Phone Number",
  showLabel = false,
  disabled = false,
  value = "",
  onChange,
}: PhoneInputFloatingLabelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === defaultCountry) || countries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const initializedRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse initial value only once on mount
  useEffect(() => {
    if (value && !initializedRef.current) {
      initializedRef.current = true;
      let foundCountry: Country | null = null;
      let cleanNumber = value.trim();
      
      // Check if value contains country code (new format: "+1[US] 1234567890")
      const countryCodeMatch = cleanNumber.match(/^([+\d-]+)\[([A-Z]{2})\]\s*(.*)$/);
      if (countryCodeMatch) {
        const [, , countryCode, number] = countryCodeMatch;
        foundCountry = countries.find((c) => c.code === countryCode) || null;
        cleanNumber = number;
      } else {
        // Fallback: try to match by dial code (old format)
        // For +1, prioritize US over Canada
        if (cleanNumber.startsWith("+1 ") || cleanNumber.startsWith("+1")) {
          foundCountry = countries.find((c) => c.code === "US") || null;
          cleanNumber = cleanNumber.replace(/^\+1\s*/, "");
        } else {
          // Sort countries by dial code length (longest first) to match correctly
          const sortedCountries = [...countries].sort(
            (a, b) => b.dial_code.length - a.dial_code.length
          );
          
          for (const country of sortedCountries) {
            if (cleanNumber.startsWith(country.dial_code)) {
              foundCountry = country;
              cleanNumber = cleanNumber.slice(country.dial_code.length).trim();
              break;
            }
          }
        }
      }
      
      if (foundCountry) {
        setSelectedCountry(foundCountry);
      }
      setPhoneNumber(cleanNumber.replace(/\D/g, ""));
    }
  }, [value]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery("");
    notifyChange(country, phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const rawValue = e.target.value.replace(/\D/g, "");
    setPhoneNumber(rawValue);
    notifyChange(selectedCountry, rawValue);
  };

  const notifyChange = (country: Country, number: string) => {
    if (onChange) {
      onChange({
        country,
        phoneNumber: number,
        // Include country code in fullNumber for disambiguation (e.g., "+1[US] 1234567890")
        fullNumber: number ? `${country.dial_code}[${country.code}] ${number}` : "",
      });
    }
  };

  return (
    <div className={cn("relative w-full max-w-sm font-sans", className)}>
      {showLabel && (
        <label className="block text-sm text-gray-600 mb-2">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute top-0 left-0 flex h-full items-center pl-3">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="flex items-center gap-1 focus:outline-none disabled:cursor-not-allowed"
          >
            <img
              src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
              alt={selectedCountry.name}
              className="h-4 w-6 object-cover rounded-[2px]"
            />
            <ChevronDown className={cn("h-3 w-3 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
          <div className="h-4 w-px bg-gray-300 mx-2"></div>
          <span className="text-gray-500 text-sm">{selectedCountry.dial_code}</span>
        </div>

        <input
          type="tel"
          id="phone-floating"
          value={phoneNumber}
          onChange={handlePhoneChange}
          disabled={disabled}
          className={cn(
            "peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-3 pl-[120px] text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0",
            disabled && "bg-gray-50 cursor-not-allowed"
          )}
          placeholder="Enter phone number"
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-50 mt-1 w-[300px] origin-top-left rounded-lg border border-gray-200 bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md bg-gray-50 py-1.5 pl-9 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-auto p-1">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                <img src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} className="h-3 w-5 object-cover" />
                <span className="flex-1 text-left">{country.name}</span>
                <span className="text-gray-400">{country.dial_code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
