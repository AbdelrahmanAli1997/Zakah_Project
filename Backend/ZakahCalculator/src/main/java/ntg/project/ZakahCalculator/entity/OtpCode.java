package ntg.project.ZakahCalculator.entity;

import jakarta.persistence.*;
import lombok.*;
import ntg.project.ZakahCalculator.entity.util.OtpType;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "otp_codes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "otpCode_seq_id")
    @SequenceGenerator(
            name = "otpCode_seq_id",
            sequenceName = "otpCode_seq_id",
            allocationSize = 1
    )
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 6)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpType type;

    @Column(nullable = false)
    private boolean used;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(unique = true)
    private String resetToken;

    /* ================= BUSINESS METHODS ================= */

    public void initialize(String code, OtpType type) {
        this.code = code;
        this.type = type;
        this.used = false;
        this.resetToken = null;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = this.createdAt.plusMinutes(5);
    }

    public void regenerate(String code, OtpType type) {
        initialize(code, type);
    }

    public boolean isValid(String inputCode) {
        return !used
                && this.code.equals(inputCode)
                && LocalDateTime.now().isBefore(expiresAt);
    }

    public boolean isResetTokenValid(String token) {
        return resetToken != null
                && resetToken.equals(token)
                && LocalDateTime.now().isBefore(expiresAt);
    }

    public void markUsed() {
        this.used = true;
    }

    public void generateResetToken() {
        this.resetToken = UUID.randomUUID().toString();
    }
}
