import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';

import { AuthService } from '../../../services/auth-service/auth.service';
import { RegistrationRequest } from '../../../models/request/IAuthRequest';
import { UserType } from '../../../models/enums/UserType';
import { environment } from '../../../../environments/environment';
import { LeftSectionViewComponent } from '../left-section-view/left-section-view.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LeftSectionViewComponent],
  templateUrl: './register.html'
})
export class RegisterComponent implements OnInit {

  private readonly COMPANY_TYPE_KEY = 'company_type';
  secretKey = environment.secretKey;

  registerForm!: FormGroup;
  isLoading = signal(false);
  isFormValid = signal(false);

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.registerForm.valueChanges.subscribe(() => {
      this.isFormValid.set(this.registerForm.valid);
    });
  }

   togglePassword() {
    this.showPassword.set(!this.showPassword());
  }
   toggleConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  private initForm() {
  
  this.registerForm = this.fb.group({
  name: ['', Validators.required],
  email: ['', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  ]],
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(64),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
  ]],
  confirmPassword: ['', Validators.required],
  persona: ['', Validators.required],
  companyType: ['']
}, { validators: this.passwordMatchValidator });


    this.isFormValid.set(this.registerForm.valid);
  }

  get f() {
    return this.registerForm.controls;
  }

  selectPersona(type: 'individual' | 'company') {
    this.registerForm.patchValue({ persona: type });
    if (type !== 'company') {
      localStorage.removeItem(this.COMPANY_TYPE_KEY);
    }
  }

  selectCompanyType(type: 'company-software' | 'company') {
    localStorage.setItem(this.COMPANY_TYPE_KEY, type);
  }

  getCompanyType(): string | null {
    return localStorage.getItem(this.COMPANY_TYPE_KEY);
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid || this.isLoading()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.registerForm.value;
    const companyType = this.getCompanyType();

    const typeUser =
      formValue.persona === 'individual'
        ? UserType.ROLE_INDIVIDUAL
        : companyType === 'company-software'
          ? UserType.ROLE_COMPANY_SOFTWARE
          : UserType.ROLE_COMPANY;

    const request: RegistrationRequest = {
      fullName: formValue.name,
      email: formValue.email,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      userType: typeUser
    };

    this.authService.register(request).subscribe({
      next: () => {
        const encryptedEmail = CryptoJS.AES.encrypt(request.email, this.secretKey).toString();
        localStorage.removeItem(this.COMPANY_TYPE_KEY);
        this.router.navigate(['/verify-otp'], {
          queryParams: { email: encryptedEmail }
        });
      },
      error: () => {
        alert('فشل إنشاء الحساب');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
