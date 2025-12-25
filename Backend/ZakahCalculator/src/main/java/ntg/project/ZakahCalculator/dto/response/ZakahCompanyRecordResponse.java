package ntg.project.ZakahCalculator.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZakahCompanyRecordResponse {

    private Long id;

    // Assets
    private BigDecimal cashEquivalents;
    private BigDecimal accountsReceivable;
    private BigDecimal inventory;
    private BigDecimal investment;

    // Liabilities
    private BigDecimal accountsPayable;
    private BigDecimal shortTermLiability;
    private BigDecimal accruedExpenses;
    private BigDecimal yearlyLongTermLiabilities;

    // Zakah Info
    private BigDecimal goldPrice;
    private Long userId;

    // Zakah Comparison with Previous Record
    private BigDecimal previousZakahAmount;
    private BigDecimal zakahDifference;

    // Hawl Status
    private boolean hawlCompleted;
    private long daysSinceLastCalculation;
    private String message;

    // Current Record - Main Display
    private BigDecimal totalAssets;
    private BigDecimal totalLiabilities;
    private BigDecimal currentZakahPool; // Net wealth (Assets - Liabilities)
    private BigDecimal zakahAmount;
    private LocalDate calculationDate;
    private LocalDate balanceSheetDate;
}