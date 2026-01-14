// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  isOAuthUser?: boolean;
  profilePicture?: string;
  phoneNumber?: string;
  accountType?: "Advertiser" | "Publisher" | "Agency";
  createdAt?: string;
}

// Auth request types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface TwoFactorVerifyRequest {
  twoFactorCode: string;
}

// Auth response types
export interface AuthResponse {
  message: string;
  accessToken?: string;
  user?: User;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface TwoFactorSetupResponse {
  secret: string;
  otpauthUrl: string;
}

export interface ApiError {
  message: string;
  errors?: {
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
  };
}

// Admin types
export interface AdminUser {
  id: string;
  name?: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AdminDashboardResponse {
  users: AdminUser[];
}
