"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui";
import AdvertiserIcon from "@/assets/advertiser-icon.svg";
import PublisherIcon from "@/assets/publisher-icon.svg";

type AccountType = "advertiser" | "publisher" | null;

export default function AccountTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AccountType>(null);

  const handleContinue = () => {
    if (selectedType) {
      // Redirect to register page with account type
      router.push(`/register?type=${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <Image src="/logo.svg" alt="Link6ync Logo" width={48} height={60} priority />
        </Link>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose an account type</h1>
          <p className="text-base text-gray-600">Select to personalized your dashboard</p>
        </div>

        {/* Account Type Cards */}
        <div className="space-y-4 mb-8">
          {/* Advertiser Option */}
          <button
            onClick={() => setSelectedType("advertiser")}
            className={`w-full text-left transition-all duration-200 rounded-xl ${
              selectedType === "advertiser" ? "ring-2 ring-primary-600 shadow-lg" : "hover:shadow-md"
            }`}
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image src={AdvertiserIcon} alt="Advertiser" width={34} height={30} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Sign up as an Advertiser</h3>
                <p className="text-sm text-gray-600">Run ads and grow your business</p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedType === "advertiser" ? "border-primary-600 bg-primary-600" : "border-gray-300"
                  }`}
                >
                  {selectedType === "advertiser" && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Publisher Option */}
          <button
            onClick={() => setSelectedType("publisher")}
            className={`w-full text-left transition-all duration-200 rounded-xl ${
              selectedType === "publisher" ? "ring-2 ring-primary-600 shadow-lg" : "hover:shadow-md"
            }`}
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image src={PublisherIcon} alt="Publisher" width={24} height={27} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Sign up as a Publisher</h3>
                <p className="text-sm text-gray-600">Earn money by sharing ads</p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedType === "publisher" ? "border-primary-600 bg-primary-600" : "border-gray-300"
                  }`}
                >
                  {selectedType === "publisher" && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="w-full py-4 text-base font-semibold"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
