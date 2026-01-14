import api from "./client";
import type { User } from "@/types";

export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
  accountType?: "Advertiser" | "Publisher" | "Agency";
}

export interface ProfileResponse {
  message: string;
  user: User;
}

// Update user profile (name, phone number, account type)
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<ProfileResponse> => {
  const response = await api.put("/user/profile", data);
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (
  file: File
): Promise<ProfileResponse> => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await api.post("/user/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete profile picture
export const deleteProfilePicture = async (): Promise<ProfileResponse> => {
  const response = await api.delete("/user/profile/picture");
  return response.data;
};
