package ntg.project.ZakahCalculator.dto.response;

import lombok.*;
import ntg.project.ZakahCalculator.entity.util.ZakahStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZakahIndividualRecordResponse {

    private Long id;

    // Status information
    private ZakahStatus status;

    // Individual Assets
    private BigDecimal cash;
    private BigDecimal gold;
    private BigDecimal silver;
    private BigDecimal stocks;
    private BigDecimal bonds;
    private BigDecimal tradeOffers;
    private BigDecimal jewelry;
    private BigDecimal otherAssets;
    private BigDecimal loans;
    private BigDecimal debt;

    // Zakah Info
    private BigDecimal goldPrice;

    // Current Record - Main Display
    private BigDecimal totalAssets;
    private BigDecimal totalLiabilities;
    private BigDecimal zakahPool;
    private BigDecimal zakahAmount;
    private LocalDate calculationDate;

}