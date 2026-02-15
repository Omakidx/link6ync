import {
  forgotPasswordHandler,
  googleAuthCallbackHandler,
  googleOAuthHandler,
  githubOAuthHandler,
  githubAuthCallbackHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  twoFactorAuthHandler,
  twoFactorVerifyHandler,
  verify2FALoginHandler,
  disable2FAHandler,
  verifyEmailHandler,
} from "../controllers/auth/auth.controller";
import requireAuth from "../middlewares/requireAuth";
import {
  authLimiter,
  loginLimiter,
  passwordResetLimiter,
  verificationLimiter,
  twoFactorLimiter,
} from "../middlewares/rateLimiter";
import { Router } from "express";

const router = Router();

router.post("/register", authLimiter, registerHandler);
router.post("/login", loginLimiter, loginHandler);
router.get("/verify-email", verificationLimiter, verifyEmailHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);
router.post("/forgot-password", passwordResetLimiter, forgotPasswordHandler);
router.post("/reset-password", passwordResetLimiter, resetPasswordHandler);
router.get("/google", authLimiter, googleOAuthHandler);
router.get("/google/callback", googleAuthCallbackHandler);
router.get("/github", authLimiter, githubOAuthHandler);
router.get("/github/callback", githubAuthCallbackHandler);
router.get("/2fa/setup", requireAuth, twoFactorLimiter, twoFactorAuthHandler);
router.post("/2fa/verify", requireAuth, twoFactorLimiter, twoFactorVerifyHandler);
router.post("/2fa/disable", requireAuth, twoFactorLimiter, disable2FAHandler);
router.post("/2fa/verify-login", twoFactorLimiter, verify2FALoginHandler);

export default router;
