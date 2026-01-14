import { Request, Response } from "express";
import { User } from "../models/user.model";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "../configs/cloudinary";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    role: string;
    isEmailVerified: boolean;
    twoFactorEnabled: boolean;
    isOAuthUser?: boolean;
    profilePicture?: string;
    phoneNumber?: string;
    accountType?: string;
  };
}

// Update user profile (name, phoneNumber, accountType)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, phoneNumber, accountType } = req.body;

    const updateData: {
      name?: string;
      phoneNumber?: string;
      accountType?: string;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (accountType !== undefined) {
      if (!["Advertiser", "Publisher", "Agency"].includes(accountType)) {
        return res.status(400).json({ message: "Invalid account type" });
      }
      updateData.accountType = accountType;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password -twoFactorSecret -resetPasswordToken -resetPasswordExpires -tokenVersion",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        isOAuthUser: user.isOAuthUser,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get current user to check for existing profile picture
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture from Cloudinary if exists
    if (currentUser.profilePicture) {
      const publicId = extractPublicId(currentUser.profilePicture);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error("Failed to delete old profile picture:", err);
        }
      }
    }

    // Upload new profile picture to Cloudinary
    const { url } = await uploadToCloudinary(
      req.file.buffer,
      "link6ync/profile-pictures"
    );

    // Update user with new profile picture URL
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: url },
      {
        new: true,
        select: "-password -twoFactorSecret -resetPasswordToken -resetPasswordExpires -tokenVersion",
      }
    );

    return res.json({
      message: "Profile picture uploaded successfully",
      user: {
        id: user!._id,
        email: user!.email,
        name: user!.name,
        role: user!.role,
        isEmailVerified: user!.isEmailVerified,
        twoFactorEnabled: user!.twoFactorEnabled,
        isOAuthUser: user!.isOAuthUser,
        profilePicture: user!.profilePicture,
        phoneNumber: user!.phoneNumber,
        accountType: user!.accountType,
      },
    });
  } catch (error) {
    console.error("Upload profile picture error:", error);
    return res.status(500).json({ message: "Failed to upload profile picture" });
  }
};

// Delete profile picture
export const deleteProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.profilePicture) {
      return res.status(400).json({ message: "No profile picture to delete" });
    }

    // Delete from Cloudinary
    const publicId = extractPublicId(currentUser.profilePicture);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Failed to delete from Cloudinary:", err);
      }
    }

    // Remove profile picture URL from user
    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { profilePicture: 1 } },
      {
        new: true,
        select: "-password -twoFactorSecret -resetPasswordToken -resetPasswordExpires -tokenVersion",
      }
    );

    return res.json({
      message: "Profile picture deleted successfully",
      user: {
        id: user!._id,
        email: user!.email,
        name: user!.name,
        role: user!.role,
        isEmailVerified: user!.isEmailVerified,
        twoFactorEnabled: user!.twoFactorEnabled,
        isOAuthUser: user!.isOAuthUser,
        profilePicture: undefined,
        phoneNumber: user!.phoneNumber,
        accountType: user!.accountType,
      },
    });
  } catch (error) {
    console.error("Delete profile picture error:", error);
    return res.status(500).json({ message: "Failed to delete profile picture" });
  }
};
