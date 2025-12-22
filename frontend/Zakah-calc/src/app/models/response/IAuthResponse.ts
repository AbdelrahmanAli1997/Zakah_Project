

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  userResponse: UserResponse;
}

export interface DeleteAccountResponse {
  message: string;
  deletedAt: string;     // LocalDate -> ISO string
  restoreUntil: string;  // LocalDate -> ISO string
}

export interface ForgetPasswordResponse {
  message: string;
  email: string;
}
export interface ProfileUpdateResponse {
  fullName: string;
}

export interface ResetPasswordResponse {
  message: string;
  email: string;
}

import {UserType} from '../enums/UserType';

export interface UserResponse {
  userId: number;     // Long -> number
  email: string;
  fullName: string;
  userType: UserType;
}

export interface VerifyAccountResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
  resetToken?: string; // optional لو بييجي في سيناريوهات معينة
}
