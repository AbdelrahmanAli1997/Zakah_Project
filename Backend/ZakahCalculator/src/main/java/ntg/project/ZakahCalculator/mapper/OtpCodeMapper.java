package ntg.project.ZakahCalculator.mapper;

import ntg.project.ZakahCalculator.dto.response.VerifyPasswordOtpResponse;
import ntg.project.ZakahCalculator.entity.OtpCode;
import org.springframework.stereotype.Component;

@Component
public class OtpCodeMapper {

    public VerifyPasswordOtpResponse toVerifyOtpResponse(OtpCode otp) {
        return VerifyPasswordOtpResponse.builder()
                .message("OTP verified successfully")
                .resetToken(otp.getResetToken())
                .build();
    }
}

