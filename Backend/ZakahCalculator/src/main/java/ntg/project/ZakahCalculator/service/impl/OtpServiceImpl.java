package ntg.project.ZakahCalculator.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ntg.project.ZakahCalculator.dto.response.VerifyPasswordOtpResponse;
import ntg.project.ZakahCalculator.entity.OtpCode;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.entity.util.OtpType;
import ntg.project.ZakahCalculator.exception.BusinessException;
import ntg.project.ZakahCalculator.exception.ErrorCode;
import ntg.project.ZakahCalculator.mapper.OtpCodeMapper;
import ntg.project.ZakahCalculator.repository.OtpCodeRepository;
import ntg.project.ZakahCalculator.repository.UserRepository;
import ntg.project.ZakahCalculator.service.EmailService;
import ntg.project.ZakahCalculator.service.OtpService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OtpServiceImpl implements OtpService {

    private final OtpCodeRepository otpRepo;
    private final UserRepository userRepo;
    private final EmailService emailService;
    private final OtpCodeMapper otpMapper;

    @Override
    public void sendOrResend(String email, OtpType type) {

        User user = userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        OtpCode otp = otpRepo.findByUser(user)
                .orElseGet(() -> OtpCode.builder()
                        .user(user)
                        .build()
                );

        if (otp.getId() == null) {
            otp.initialize(generateOtp(), type);
        } else {
            otp.regenerate(generateOtp(), type);
        }

        otpRepo.save(otp);

        emailService.sendEmail(
                user.getEmail(),
                user.getName(),
                type,
                otp.getCode()
        );

        log.info("OTP sent to {} [{}]", user.getEmail(), type);
    }

    @Override
    public void verifyOtp(User user, String code, OtpType type) {

        OtpCode otp = otpRepo.findByUserAndType(user, type)
                .orElseThrow(() -> new BusinessException(ErrorCode.OTP_TOKEN_INVALID));

        if (!otp.isValid(code)) {
            throw new BusinessException(ErrorCode.OTP_TOKEN_INVALID);
        }

        otp.markUsed();
    }

    @Override
    public VerifyPasswordOtpResponse verifyPasswordResetOtp(User user, String code) {

        OtpCode otp = otpRepo.findByUserAndType(user, OtpType.PASSWORD_RESET)
                .orElseThrow(() -> new BusinessException(ErrorCode.OTP_TOKEN_INVALID));

        if (!otp.isValid(code)) {
            throw new BusinessException(ErrorCode.OTP_TOKEN_INVALID);
        }

        otp.markUsed();
        otp.generateResetToken();

        return otpMapper.toVerifyOtpResponse(otp);
    }

    @Override
    public User getUserByResetToken(String resetToken) {

        OtpCode otp = otpRepo.findByResetToken(resetToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.OTP_TOKEN_INVALID));

        if (!otp.isResetTokenValid(resetToken)) {
            throw new BusinessException(ErrorCode.OTP_TOKEN_EXPIRED);
        }

        return otp.getUser();
    }

    private String generateOtp() {
        return String.format("%06d", (int) (Math.random() * 1_000_000));
    }
}
