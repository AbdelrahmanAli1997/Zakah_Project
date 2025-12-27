package ntg.project.ZakahCalculator.controller;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ntg.project.ZakahCalculator.dto.request.*;
import ntg.project.ZakahCalculator.dto.response.*;
import ntg.project.ZakahCalculator.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    /* ===========================
       AUTHENTICATION (LOGIN / REGISTER)
       =========================== */

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegistrationRequest request) {
        authenticationService.register(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody @Valid RefreshRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request));
    }

    /* ===========================
       ACCOUNT VERIFICATION
       =========================== */

    @PostMapping("/account/verify-account")
    public ResponseEntity<AuthenticationResponse> verifyAccount(@RequestBody @Valid VerifyAccountRequest request) {
        return ResponseEntity.ok(authenticationService.verifyAccount(request));
    }

    @PostMapping("/account/resend-otp")
    public ResponseEntity<Void> resendAccountOtp(@RequestBody @Valid ResendOtpRequest request) {
        authenticationService.resendAccountVerificationOtp(request);
        return ResponseEntity.ok().build();
    }

    /* ===========================
       PASSWORD MANAGEMENT (FORGET / RESET)
       =========================== */

    @PostMapping("/password/forget-password")
    public ResponseEntity<ForgetPasswordResponse> forgetPassword(@RequestBody @Valid ForgetPasswordRequest request) throws MessagingException {
        return ResponseEntity.ok(authenticationService.forgetPassword(request));
    }

    @PostMapping("/password/verify-otp")
    public ResponseEntity<VerifyPasswordOtpResponse> verifyPasswordOtp(@RequestBody @Valid VerifyOtpRequest request) {
        return ResponseEntity.ok(authenticationService.verifyPasswordOtp(request));
    }

    @PostMapping("/password/resend-otp")
    public ResponseEntity<Void> resendPasswordOtp(@RequestBody @Valid ResendOtpRequest request) {
        authenticationService.resendPasswordVerificationOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/password/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        return ResponseEntity.ok(authenticationService.resetPassword(request));
    }
}
