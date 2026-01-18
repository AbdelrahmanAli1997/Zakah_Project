import { DoCheck, inject, Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthenticationResponse,
  ForgetPasswordResponse,
  ResetPasswordResponse,
  VerifyPasswordOtpResponse
} from '../../models/response/IAuthResponse';
import { AuthStorageService } from '../storage-service/StorageService';
import {
  AuthenticationRequest,
  ForgetPasswordRequest,
  RefreshRequest,
  RegistrationRequest, ResendOtpRequest,
  ResetPasswordRequest,
  VerifyAccountRequest,
  VerifyOtpRequest
} from '../../models/request/IAuthRequest';
import {environment} from '../../../environments/environment';
import { ZakahCompanyRecordService } from '../zakah-company-service/zakah-company-service';
import { ZakahIndividualRecordService } from '../zakah-individual-service/zakah-individual-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  private readonly BASE_URL =  `${environment.apiUrl}/auth`;
  private _companyService = inject(ZakahCompanyRecordService);
  private _individualService = inject(ZakahIndividualRecordService);

  isLoggedIn = signal<boolean>(false);

  constructor(private http: HttpClient) {
this.isLoggedIn.set(!!AuthStorageService.getAccessToken());
  }
  ngOnInit(): void {
  }
  /* ================= AUTH ================= */

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.BASE_URL}/login`, request)
      .pipe(
        tap(res =>{
          AuthStorageService.saveTokens(res)
          this.isLoggedIn.set(true);
        })

      );
  }

  register(request: RegistrationRequest): Observable<void> {
    return this.http.post<void>(`${this.BASE_URL}/register`, request);
  }

  refreshToken(): Observable<AuthenticationResponse> {
    const refreshToken = AuthStorageService.getRefreshToken();

    return this.http
      .post<AuthenticationResponse>(
        `${this.BASE_URL}/refresh-token`,
        { refreshToken } as RefreshRequest
      )
      .pipe(
        tap(res => AuthStorageService.saveTokens(res))
      );
  }

  /* ================= ACCOUNT VERIFICATION ================= */
  verifyAccount(request: VerifyAccountRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.BASE_URL}/account/verify-account`, request)
      .pipe(
        tap(res => {
          AuthStorageService.saveTokens(res)
          this.isLoggedIn.set(true);
        })
      );
  }

  resendAccountOtp(request: ResendOtpRequest):Observable<void>{
    return this.http.post<void>(`${this.BASE_URL}/account/resend-otp`, request);
  }

  /* ================= PASSWORD ================= */

  forgetPassword(
    request: ForgetPasswordRequest
  ): Observable<ForgetPasswordResponse> {
    return this.http.post<ForgetPasswordResponse>(
      `${this.BASE_URL}/password/forget-password`,
      request
    );
  }

  verifyPasswordOtp(
    request: VerifyOtpRequest
  ): Observable<VerifyPasswordOtpResponse> {
    return this.http.post<VerifyPasswordOtpResponse>(
      `${this.BASE_URL}/password/verify-otp`,
      request
    );
  }

  resendPasswordOtp(request: ResendOtpRequest): Observable<void>{
    return this.http.post<void>(`${this.BASE_URL}/password/resend-otp`,request);
  }

  resetPassword(
    request: ResetPasswordRequest
  ): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.BASE_URL}/password/reset-password`,
      request
    );
  }


  /* ================= LOGOUT ================= */

  logout(): void {
    AuthStorageService.clear();
    this._companyService.resetForm();
    this._individualService.resetForm();
    this.isLoggedIn.set(false);
    
  }
}
