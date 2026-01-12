import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import { Request, Response } from "express";

const router = Router();

router.get("/me", requireAuth, (req: Request, res: Response) => {
  const authReq = req as any;

  const user = authReq.user;

  return res.json({
    user,
  });
});

export default router;
