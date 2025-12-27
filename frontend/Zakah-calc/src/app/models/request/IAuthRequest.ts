/* ===========================
   AUTHENTICATION REQUESTS
   =========================== */
export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

/* ===========================
   REGISTRATION & ACCOUNT VERIFICATION
   =========================== */
import { UserType } from '../enums/UserType';

export interface RegistrationRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType?: UserType;
}

export interface VerifyAccountRequest {
  email: string;
  otpCode: string;
}

export interface ResendOtpRequest {
  email?: string;
}

/* ===========================
   PASSWORD MANAGEMENT
   =========================== */
export interface ForgetPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/* ===========================
   PROFILE MANAGEMENT
   =========================== */
export interface ProfileUpdateRequest {
  fullName?: string;
}
