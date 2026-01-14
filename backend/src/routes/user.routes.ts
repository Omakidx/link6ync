import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import { Request, Response } from "express";
import { upload } from "../middlewares/multer";
import { User } from "../models/user.model";
import {
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
} from "../controllers/user.controller";

const router = Router();

// Get current user
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const authReq = req as any;
  const userId = authReq.user.id;

  try {
    const user = await User.findById(userId).select(
      "-password -twoFactorSecret -resetPasswordToken -resetPasswordExpires -tokenVersion"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
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
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Failed to get user" });
  }
});

// Update profile (name, phoneNumber, accountType)
router.put("/profile", requireAuth, updateProfile as any);

// Upload profile picture
router.post(
  "/profile/picture",
  requireAuth,
  upload.single("profilePicture"),
  uploadProfilePicture as any
);

// Delete profile picture
router.delete("/profile/picture", requireAuth, deleteProfilePicture as any);

export default router;
