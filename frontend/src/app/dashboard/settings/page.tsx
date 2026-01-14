"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Pencil, ChevronDown, Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import PhoneInputFloatingLabel from "@/components/ui/PhoneInputFloatingLabel";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import {
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
} from "@/lib/api/user";

type TabType = "profile" | "payment" | "notification" | "account-security";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useToastStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isDeletingPicture, setIsDeletingPicture] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    accountType: "Advertiser" as "Advertiser" | "Publisher" | "Agency",
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        accountType: user.accountType || "Advertiser",
      });
    }
  }, [user]);

  const tabs: { id: TabType; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "payment", label: "Payment" },
    { id: "notification", label: "Notification" },
    { id: "account-security", label: "Account Security" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await updateProfile({
        name: formData.fullName,
        phoneNumber: formData.phoneNumber,
        accountType: formData.accountType,
      });
      setUser(response.user);
      setIsEditing(false);
      addToast({ message: "Profile updated successfully", type: "success" });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update profile";
      addToast({ message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      addToast({ message: "Only image files (JPEG, PNG, GIF, WebP) are allowed", type: "error" });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast({ message: "File size must be less than 5MB", type: "error" });
      return;
    }

    setIsUploadingPicture(true);
    try {
      const response = await uploadProfilePicture(file);
      setUser(response.user);
      addToast({ message: "Profile picture uploaded successfully", type: "success" });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to upload profile picture";
      addToast({ message, type: "error" });
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePicture = async () => {
    if (!user?.profilePicture) return;

    setIsDeletingPicture(true);
    try {
      const response = await deleteProfilePicture();
      setUser(response.user);
      addToast({ message: "Profile picture deleted successfully", type: "success" });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete profile picture";
      addToast({ message, type: "error" });
    } finally {
      setIsDeletingPicture(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your profile, payment, and account settings
          </p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#003DB8] text-white text-sm font-medium rounded-lg hover:bg-[#002d8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-6 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-[#003DB8]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003DB8]" />
            )}
          </button>
        ))}
      </div>

      {/* Profile Settings Content */}
      {activeTab === "profile" && (
        <div className="space-y-8">
          {/* Profile Settings Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Profile Settings
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              When your password, email, or payout details change
            </p>

            {/* Profile Picture */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/assets/account-icon.svg"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="opacity-50"
                  />
                )}
                {isUploadingPicture && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#003DB8]" />
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Button */}
              <button
                onClick={handleUploadClick}
                disabled={isUploadingPicture}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingPicture ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Upload
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                        stroke="#4A5565"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.3333 5.33333L8 2L4.66667 5.33333"
                        stroke="#4A5565"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 2V10"
                        stroke="#4A5565"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Delete Button - only show if user has a profile picture */}
              {user?.profilePicture && (
                <button
                  onClick={handleDeletePicture}
                  disabled={isDeletingPicture}
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete profile picture"
                >
                  {isDeletingPicture ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  ) : (
                    <Image
                      src="/assets/delete-icon.svg"
                      alt="Delete"
                      width={18}
                      height={20}
                    />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-gray-900">
                Personal Information
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg text-sm text-gray-900 disabled:cursor-not-allowed ${
                    isEditing 
                      ? "border-[#003DB8] ring-2 ring-[#003DB8]/20 bg-white" 
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Phone Number
                </label>
                <PhoneInputFloatingLabel
                  defaultCountry="NG"
                  className={`max-w-full ${isEditing ? "[&_input]:border-[#003DB8] [&_input]:ring-2 [&_input]:ring-[#003DB8]/20 [&_input]:bg-white" : ""}`}
                  disabled={!isEditing}
                  value={formData.phoneNumber}
                  onChange={(data) => handleInputChange("phoneNumber", data.fullNumber)}
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Account Type
                </label>
                <div className="relative">
                  <select
                    value={formData.accountType}
                    onChange={(e) =>
                      handleInputChange("accountType", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg text-sm text-gray-900 appearance-none cursor-pointer disabled:cursor-not-allowed ${
                      isEditing 
                        ? "border-[#003DB8] ring-2 ring-[#003DB8]/20 bg-white" 
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <option value="Advertiser">Advertiser</option>
                    <option value="Publisher">Publisher</option>
                    <option value="Agency">Agency</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-red-600 mb-1">
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-500">
                  You can delete your account from here and all the data associated to it
                </p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                <Image
                  src="/assets/delete-icon.svg"
                  alt="Delete"
                  width={16}
                  height={16}
                  className="brightness-0 invert"
                />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Tab Content */}
      {activeTab === "payment" && (
        <div className="text-center py-16 text-gray-500">
          <p>Payment settings coming soon...</p>
        </div>
      )}

      {/* Notification Tab Content */}
      {activeTab === "notification" && (
        <div className="text-center py-16 text-gray-500">
          <p>Notification settings coming soon...</p>
        </div>
      )}

      {/* Account Security Tab Content */}
      {activeTab === "account-security" && (
        <div className="text-center py-16 text-gray-500">
          <p>Account security settings coming soon...</p>
        </div>
      )}
    </div>
  );
}
