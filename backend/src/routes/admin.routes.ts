import requireAuth from "@/middlewares/requireAuth";
import requireRole from "@/middlewares/requireRole";
import { Router } from "express";
import type { Request, Response } from "express";
import { User } from "@/models/user.model";

const router = Router();

router.get("/admin/dashboard", requireAuth, requireRole("admin"), async (req: Request, res: Response) => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        email: 1,
        role: 1,
        isEmailVerified: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    const result = users.map((user: any) => {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };
    });

    return res.status(200).json({
      users: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
