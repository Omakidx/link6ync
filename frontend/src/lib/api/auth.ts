import api, { setAccessToken, removeAccessToken } from "./client";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  TwoFactorVerifyRequest,
  RegisterResponse,
  LoginResponse,
  RefreshResponse,
  TwoFactorSetupResponse,
  AuthResponse,
  User,
} from "@/types";

// Register new user
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data;
};

// Login user
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  if (response.data.accessToken) {
    setAccessToken(response.data.accessToken);
  }
  return response.data;
};

// Logout user
export const logout = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/logout");
  removeAccessToken();
  return response.data;
};

// Refresh token
export const refreshToken = async (): Promise<RefreshResponse> => {
  const response = await api.post<RefreshResponse>("/auth/refresh");
  if (response.data.accessToken) {
    setAccessToken(response.data.accessToken);
  }
  return response.data;
};

// Forgot password
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/forgot-password", data);
  return response.data;
};

// Reset password
export const resetPassword = async (data: ResetPasswordRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/reset-password", data);
  return response.data;
};

// Verify email
export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>(`/auth/verify-email?token=${token}`);
  return response.data;
};

// Get Google OAuth URL
export const getGoogleAuthUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${apiUrl}/auth/google`;
};

// Get GitHub OAuth URL
export const getGitHubAuthUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${apiUrl}/auth/github`;
};

// Two-factor authentication setup
export const setup2FA = async (): Promise<TwoFactorSetupResponse> => {
  const response = await api.get<TwoFactorSetupResponse>("/auth/2fa/setup");
  return response.data;
};

// Verify and enable 2FA
export const verify2FA = async (data: TwoFactorVerifyRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/2fa/verify", data);
  return response.data;
};

// Disable 2FA
export const disable2FA = async (twoFactorCode: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/2fa/disable", { twoFactorCode });
  return response.data;
};

// Verify 2FA for OAuth login
export const verify2FALogin = async (tempToken: string, twoFactorCode: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/2fa/verify-login", { tempToken, twoFactorCode });
  if (response.data.accessToken) {
    setAccessToken(response.data.accessToken);
  }
  return response.data;
};

// Get current user
export const getCurrentUser = async (): Promise<{
  user: User;
}> => {
  const response = await api.get<{
    user: User;
  }>("/user/me");
  return response.data;
};
