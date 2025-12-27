package ntg.project.ZakahCalculator.repository;

import ntg.project.ZakahCalculator.entity.OtpCode;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.entity.util.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    Optional<OtpCode> findByUser(User user);

    Optional<OtpCode> findByUserAndType(User user, OtpType type);

    Optional<OtpCode> findByResetToken(String resetToken);
}
