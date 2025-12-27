package ntg.project.ZakahCalculator.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    @Size(min = 1, max = 25, message = "VALIDATION.UPDATE_PROFILE.FULLNAME.SIZE")
    private String fullName;

}
