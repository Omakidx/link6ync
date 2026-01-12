import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/libs/token";
import { User } from "@/models/user.model";

const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Attach user to request object
    const authReq = req as any;
    authReq.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      isOAuthUser: user.isOAuthUser,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export default requireAuth;
