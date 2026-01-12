import { Request, Response, NextFunction } from "express";

const requireRole = (role: "user" | "admin") => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const authReq = req as any;
    const user = authReq.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (user.role !== role) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};

export default requireRole;
