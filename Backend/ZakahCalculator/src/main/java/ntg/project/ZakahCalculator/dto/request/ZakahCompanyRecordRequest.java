package ntg.project.ZakahCalculator.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZakahCompanyRecordRequest {

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal cashEquivalents;

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal accountsReceivable;

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal inventory;

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal investment;
    @NotBlank(message = "This field can't be Empty")
    private BigDecimal accountsPayable;
    @NotBlank(message = "This field can't be Empty")
    private BigDecimal shortTermLiability;
    @NotBlank(message = "This field can't be Empty")
    private BigDecimal accruedExpenses;
    @NotBlank(message = "This field can't be Empty")
    private BigDecimal yearly_long_term_liabilities;

    @NotBlank(message = "This field can't be Empty")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate balance_sheet_date;

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal goldPrice;

    @NotBlank(message = "This field can't be Empty")
    private Long userId;


}
