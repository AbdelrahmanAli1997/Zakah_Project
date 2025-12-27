package ntg.project.ZakahCalculator.dto.response;


import lombok.*;
import ntg.project.ZakahCalculator.entity.util.UserType;

@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserResponse {
    private String email;
    private String fullName;
    private UserType userType;
    private boolean isVerified;
    private boolean isDeleted;
}
