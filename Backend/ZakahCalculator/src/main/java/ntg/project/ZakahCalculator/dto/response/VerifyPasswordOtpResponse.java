package ntg.project.ZakahCalculator.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifyPasswordOtpResponse {
    private String message;
    private String resetToken;
}
