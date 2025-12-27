package ntg.project.ZakahCalculator.service;

import ntg.project.ZakahCalculator.dto.response.VerifyPasswordOtpResponse;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.entity.util.OtpType;

public interface OtpService {

    void sendOrResend(String email, OtpType type);

    void verifyOtp(User user, String code, OtpType type);

    VerifyPasswordOtpResponse verifyPasswordResetOtp(User user, String code);

    User getUserByResetToken(String resetToken);
}
