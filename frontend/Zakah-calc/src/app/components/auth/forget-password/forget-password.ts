import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth-service/auth.service';
import {
  ForgetPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest
} from '../../../models/request/IAuthRequest';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css'],
  imports: [RouterLink]
})
export class ForgetPassword {
  // ===== Signals =====
  email = signal('');
  emailError = signal<string | null>(null);

  otp = signal('');
  otpError = signal<string | null>(null);

  newPassword = signal('');
  confirmPassword = signal('');
  passwordError = signal<string | null>(null);

  isLoading = signal(false);
  step = signal<'email' | 'otp' | 'reset'>('email'); // current step

  constructor(private authService: AuthService, private router: Router) {}

  // ===== Email Step =====
  onEmailChange(event: Event) {
    this.email.set((event.target as HTMLInputElement).value);
    if (this.emailError()) this.emailError.set(null);
  }

  private validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email()) {
      this.emailError.set('البريد الإلكتروني مطلوب');
      return false;
    }
    if (!emailRegex.test(this.email())) {
      this.emailError.set('الرجاء إدخال بريد إلكتروني صالح');
      return false;
    }
    this.emailError.set(null);
    return true;
  }

sendOtp() {
  if (!this.validateEmail() || this.isLoading()) return;

  this.isLoading.set(true);
  this.authService.forgetPassword({ email: this.email() })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: () => {

        this.router.navigate(['/verify-otp'], { 
          state: { email: this.email() } 
        });
      },
      error: () => this.emailError.set('حدث خطأ، حاول مرة أخرى لاحقاً')
    });
}

  // ===== OTP Step =====
  onOtpChange(event: Event) {
    this.otp.set((event.target as HTMLInputElement).value);
    if (this.otpError()) this.otpError.set(null);
  }

  validateOtp(): boolean {
    if (!this.otp()) {
      this.otpError.set('الرجاء إدخال رمز التحقق');
      return false;
    }
    this.otpError.set(null);
    return true;
  }

  verifyOtp() {
    if (!this.validateOtp() || this.isLoading()) return;

    this.isLoading.set(true);
    const data: VerifyOtpRequest = { email: this.email(), otp: this.otp() };

    this.authService.verifyOtp(data)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.step.set('reset'),
        error: () => this.otpError.set('رمز التحقق غير صحيح أو منتهي الصلاحية')
      });
  }

  // ===== Reset Password Step =====
  onPasswordChange(event: Event) { this.newPassword.set((event.target as HTMLInputElement).value); }
  onConfirmPasswordChange(event: Event) { this.confirmPassword.set((event.target as HTMLInputElement).value); }

  validatePasswords(): boolean {
    if (!this.newPassword() || !this.confirmPassword()) {
      this.passwordError.set('الرجاء إدخال كلمة المرور وتأكيدها');
      return false;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordError.set('كلمتا المرور غير متطابقتين');
      return false;
    }
    this.passwordError.set(null);
    return true;
  }

  resetPassword() {
    if (!this.validatePasswords() || this.isLoading()) return;

    this.isLoading.set(true);
    const data: ResetPasswordRequest = {
      email: this.email(),
      otpCode: this.otp(),
      newPassword: this.newPassword(),
      confirmPassword: this.confirmPassword()
    };

    this.authService.resetPassword(data)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => this.passwordError.set('فشل إعادة تعيين كلمة المرور، حاول لاحقاً')
      });
  }
}
