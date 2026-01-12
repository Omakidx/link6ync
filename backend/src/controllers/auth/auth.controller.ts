import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import { User } from "@/models/user.model";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from "@/libs/email";
import { hashPassword, checkPass } from "@/libs/hashed";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "@/libs/token";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { authenticator } from "otplib";

const getAppUrl = function () {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
};

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URL || `${getAppUrl()}/auth/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials are not set in environment variables");
  }

  return new OAuth2Client({ clientId, clientSecret, redirectUri });
};

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.flatten(),
      });
    }
    const { email, password } = result.data;

    const normalized = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalized });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPass = await hashPassword(password);

    const newUser = await User.create({
      email: normalized,
      password: hashedPass,
      role: "user",
      isEmailVerified: false,
      twoFactorEnabled: false,
      name: result.data.name,
    });

    //Email verification process here

    const verifyToken = jwt.sign(
      {
        sub: newUser.id,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET!,

      {
        expiresIn: "1d",
      }
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyUrl = `${frontendUrl}/verify-email?token=${verifyToken}`;
    await sendVerificationEmail(newUser.email!, verifyUrl, newUser.name ?? undefined);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({
      message: "verfication token is missing",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as {
      sub: string;
    };

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        message: "Email is now verified",
      });
    }

    user.isEmailVerified = true;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email!, user.name ?? undefined);
    } catch (emailError) {
      // Log error but don't fail the verification
      console.error("Failed to send welcome email:", emailError);
    }

    return res.json({ message: "Email is now verified" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.flatten(),
      });
    }

    const { email, password, twoFactorCode } = result.data;

    const normalized = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalized });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Password logic
    const ok = await checkPass(password, user.password!);

    if (!ok) {
      return res.status(403).json({ message: "Invalid Email or Password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorCode || typeof twoFactorCode !== "string") {
        return res.status(400).json({ message: "Two-factor authentication code is required" });
      }

      if (!user.twoFactorSecret) {
        return res.status(500).json({ message: "Two-factor authentication is not properly set up for this account" });
      }

      // Verify the provided 2FA code
      const isValid = authenticator.check(twoFactorCode, user.twoFactorSecret);
      if (!isValid) {
        return res.status(403).json({ message: "Invalid two-factor authentication code" });
      }
    }

    // Create tokens using helper functions
    const accessToken = createAccessToken(user.id, user.role as "user" | "admin", user.tokenVersion);
    const refreshToken = createRefreshToken(user.id, user.role as "user" | "admin", user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    const newAccessToken = createAccessToken(user.id, user.role as "user" | "admin", user.tokenVersion);
    const newRefreshToken = createRefreshToken(user.id, user.role as "user" | "admin", user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Token Refreshed",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const normalized = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalized });

    if (!user) {
      return res.status(201).json({ message: "If an account with this email exists, we would send you a reset link" });
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail(user.email!, resetUrl, user.name ?? undefined);

    return res.status(201).json({ message: "If an account with this email exists, we would send you a reset link" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { token, password } = req.body as { token?: string; password?: string };

  if (!token) {
    return res.status(400).json({ message: "Reset token is missing" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Check if new password is the same as current password
    const isSamePassword = await checkPass(password, user.password!);
    if (isSamePassword) {
      return res.status(400).json({ message: "Current password can't be set as new password" });
    }

    const newHashedPass = await hashPassword(password);
    user.password = newHashedPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.tokenVersion += 1;
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// GitHub OAuth helpers
const getGitHubConfig = () => {
  const clientId = process.env.GITHUB_CLIENT_ID!;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET!;
  const redirectUri = process.env.GITHUB_REDIRECT_URL || `${getAppUrl()}/auth/github/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("GitHub OAuth credentials are not set in environment variables");
  }

  return { clientId, clientSecret, redirectUri };
};

export const githubOAuthHandler = async (req: Request, res: Response) => {
  try {
    const { clientId, redirectUri } = getGitHubConfig();
    const scope = "user:email";

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;

    return res.redirect(url);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const githubAuthCallbackHandler = async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=Missing authorization code`);
  }

  try {
    const { clientId, clientSecret, redirectUri } = getGitHubConfig();

    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (tokenData.error) {
      console.error("GitHub token error:", tokenData);
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(tokenData.error_description || "Authentication failed")}`
      );
    }

    const accessToken = tokenData.access_token;

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const githubUser = (await userResponse.json()) as {
      email?: string;
      name?: string;
      login?: string;
    };

    // Get user emails (in case primary email is private)
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const emails = (await emailsResponse.json()) as Array<{
      email: string;
      primary: boolean;
      verified: boolean;
    }>;

    // Find primary verified email
    const primaryEmail = emails.find((e) => e.primary && e.verified);
    const email = primaryEmail?.email || githubUser.email;

    if (!email) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent("No verified email found on GitHub account")}`
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const passwordHash = await hashPassword(randomPassword);

      user = await User.create({
        email: normalizedEmail,
        password: passwordHash,
        role: "user",
        isEmailVerified: true,
        twoFactorEnabled: false,
        isOAuthUser: true,
        name: githubUser.name || githubUser.login,
      });
    } else {
      // Check if user signed up with email/password (not OAuth)
      if (!user.isOAuthUser) {
        return res.redirect(
          `${frontendUrl}/login?error=${encodeURIComponent(
            "This email is registered with email and password. Please sign in using your password."
          )}`
        );
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }
    }

    // Check if user has 2FA enabled
    if (user.twoFactorEnabled) {
      const tempToken = jwt.sign({ sub: user.id, purpose: "2fa-verify" }, process.env.JWT_ACCESS_TOKEN_SECRET!, {
        expiresIn: "5m",
      });
      return res.redirect(`${frontendUrl}/callback?requires2fa=true&tempToken=${tempToken}&provider=github`);
    }

    const jwtAccessToken = createAccessToken(user.id, user.role as "user" | "admin", user.tokenVersion);
    const refreshToken = createRefreshToken(user.id, user.role as "user" | "admin", user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${frontendUrl}/callback?token=${jwtAccessToken}&provider=github`);
  } catch (error: any) {
    console.error("GitHub OAuth callback error:", error);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent("Authentication failed")}`);
  }
};

export const googleOAuthHandler = async (req: Request, res: Response) => {
  try {
    const client = getGoogleClient();
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "select_account",
      scope: ["openid", "profile", "email"],
    });

    return res.redirect(url);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleAuthCallbackHandler = async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).json({
      message: "Missing code in callback",
    });
  }

  try {
    const client = getGoogleClient();

    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({ message: "No google ID Token is present" });
    }

    //verify ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();

    const email = payload?.email;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      return res.status(400).json({ message: "Google email account is not verfied" });
    }

    const normalizedEmail = email?.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const passwordHash = await hashPassword(randomPassword);

      user = await User.create({
        email: normalizedEmail,
        password: passwordHash,
        role: "user",
        isEmailVerified: true,
        twoFactorEnabled: false,
        isOAuthUser: true,
      });
    } else {
      // Check if user signed up with email/password (not OAuth)
      if (!user.isOAuthUser) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        return res.redirect(
          `${frontendUrl}/login?error=${encodeURIComponent(
            "This email is registered with email and password. Please sign in using your password."
          )}`
        );
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Check if user has 2FA enabled
    if (user.twoFactorEnabled) {
      // Create a temporary token for 2FA verification
      const tempToken = jwt.sign({ sub: user.id, purpose: "2fa-verify" }, process.env.JWT_ACCESS_TOKEN_SECRET!, {
        expiresIn: "5m",
      });
      return res.redirect(`${frontendUrl}/callback?requires2fa=true&tempToken=${tempToken}&provider=google`);
    }

    const accessToken = createAccessToken(user.id, user.role as "user" | "admin", user.tokenVersion);

    const refreshToken = createRefreshToken(user.id, user.role as "user" | "admin", user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with access token
    return res.redirect(`${frontendUrl}/callback?token=${accessToken}&provider=google`);
  } catch (error: any) {
    console.error("Google OAuth callback error:", error);

    // Handle specific OAuth errors
    if (error?.response?.data?.error === "invalid_grant") {
      return res.status(400).json({
        message: "Authorization code has expired or already been used. Please try signing in again.",
      });
    }

    if (error?.message?.includes("invalid_grant")) {
      return res.status(400).json({
        message: "Authorization code has expired or already been used. Please try signing in again.",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const twoFactorAuthHandler = async (req: Request, res: Response) => {
  const authReq = req as any;
  const authUser = authReq.user;

  if (!authUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(authUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = authenticator.generateSecret();

    const issuer = process.env.TWO_FACTOR_AUTH_ISSUER || "MyApp";

    const otpauth = authenticator.keyuri(user.email!, issuer, secret);

    user.twoFactorSecret = secret;
    user.twoFactorEnabled = false;
    await user.save();

    return res.status(200).json({
      message: "Two-factor authentication enabled",
      otpauthUrl: otpauth,
      secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const twoFactorVerifyHandler = async (req: Request, res: Response) => {
  const { twoFactorCode } = req.body as { twoFactorCode?: string };
  const authReq = req as any;
  const authUser = authReq.user;

  if (!authUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!twoFactorCode || typeof twoFactorCode !== "string") {
    return res.status(400).json({ message: "Two-factor authentication code is required" });
  }

  try {
    const user = await User.findById(authUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: "Please set up two-factor authentication first" });
    }

    const isValid = authenticator.check(twoFactorCode, user.twoFactorSecret);

    if (!isValid) {
      return res.status(403).json({ message: "Invalid two-factor authentication code" });
    }

    user.twoFactorEnabled = true;
    await user.save();
    return res.json({ message: "2FA enabled successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify 2FA for OAuth login
// Disable 2FA
export const disable2FAHandler = async (req: Request, res: Response) => {
  const { twoFactorCode } = req.body as { twoFactorCode?: string };
  const authReq = req as any;
  const authUser = authReq.user;

  if (!authUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!twoFactorCode || typeof twoFactorCode !== "string") {
    return res.status(400).json({ message: "Two-factor authentication code is required" });
  }

  try {
    const user = await User.findById(authUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: "Two-factor authentication is not enabled" });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: "Two-factor secret not found" });
    }

    // Verify the provided 2FA code before disabling
    const isValid = authenticator.check(twoFactorCode, user.twoFactorSecret);

    if (!isValid) {
      return res.status(403).json({ message: "Invalid two-factor authentication code" });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    return res.json({ message: "Two-factor authentication disabled successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verify2FALoginHandler = async (req: Request, res: Response) => {
  const { tempToken, twoFactorCode } = req.body as { tempToken?: string; twoFactorCode?: string };

  if (!tempToken) {
    return res.status(400).json({ message: "Temporary token is required" });
  }

  if (!twoFactorCode || typeof twoFactorCode !== "string") {
    return res.status(400).json({ message: "Two-factor authentication code is required" });
  }

  try {
    // Verify the temporary token
    const payload = jwt.verify(tempToken, process.env.JWT_ACCESS_TOKEN_SECRET!) as {
      sub: string;
      purpose: string;
    };

    if (payload.purpose !== "2fa-verify") {
      return res.status(400).json({ message: "Invalid token purpose" });
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: "Two-factor authentication is not set up for this account" });
    }

    const isValid = authenticator.check(twoFactorCode, user.twoFactorSecret);

    if (!isValid) {
      return res.status(403).json({ message: "Invalid two-factor authentication code" });
    }

    // 2FA verified, create full tokens
    const accessToken = createAccessToken(user.id, user.role as "user" | "admin", user.tokenVersion);
    const refreshToken = createRefreshToken(user.id, user.role as "user" | "admin", user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please sign in again." });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
