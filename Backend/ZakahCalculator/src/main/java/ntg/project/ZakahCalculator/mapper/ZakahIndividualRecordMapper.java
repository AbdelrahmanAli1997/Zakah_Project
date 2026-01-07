package ntg.project.ZakahCalculator.mapper;

import lombok.RequiredArgsConstructor;
import ntg.project.ZakahCalculator.dto.request.ZakahIndividualRecordRequest;
import ntg.project.ZakahCalculator.dto.response.ZakahIndividualRecordResponse;
import ntg.project.ZakahCalculator.dto.response.ZakahIndividualRecordSummaryResponse;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.entity.ZakahIndividualRecord;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ZakahIndividualRecordMapper {

    // تحويل Request DTO إلى Entity
    public ZakahIndividualRecord toEntity(ZakahIndividualRecordRequest request, User user) {
        if (request == null) return null;

        ZakahIndividualRecord record = new ZakahIndividualRecord();
        record.setCash(nullToZero(request.getCash()));
        record.setGold(nullToZero(request.getGold()));
        record.setSilver(nullToZero(request.getSilver()));
        record.setStocks(nullToZero(request.getStocks()));
        record.setBonds(nullToZero(request.getBonds()));
        record.setTradeOffers(nullToZero(request.getTradeOffers()));
        record.setJewelry(nullToZero(request.getJewelry()));
        record.setOtherAssets(nullToZero(request.getOtherAssets()));
        record.setLoans(nullToZero(request.getLoans()));
        record.setDebt(nullToZero(request.getDebt()));
        record.setGoldPrice(nullToZero(request.getGoldPrice()));
        record.setCalculationDate(request.getCalculationDate());
        record.setUser(user);

        return record;
    }

    // تحويل Entity إلى Detailed Response
    public ZakahIndividualRecordResponse toDetailedResponse(ZakahIndividualRecord entity) {
        if (entity == null) return null;

        BigDecimal totalAssets = calculateTotalAssets(entity);

        return ZakahIndividualRecordResponse.builder()
                .id(entity.getId())
                .status(entity.getStatus())
                .cash(entity.getCash())
                .gold(entity.getGold())
                .silver(entity.getSilver())
                .stocks(entity.getStocks())
                .bonds(entity.getBonds())
                .tradeOffers(entity.getTradeOffers())
                .jewelry(entity.getJewelry())
                .otherAssets(entity.getOtherAssets())
                .loans(entity.getLoans())
                .debt(entity.getDebt())
                .goldPrice(entity.getGoldPrice())
                .totalAssets(totalAssets)
                .totalLiabilities(entity.getTotalLiabilities())
                .zakahPool(entity.getZakahPool())
                .zakahAmount(entity.getZakahAmount())
                .calculationDate(entity.getCalculationDate())
                .build();
    }

    // تحويل Entity إلى Summary Response
    public ZakahIndividualRecordSummaryResponse toSummaryResponse(ZakahIndividualRecord entity) {
        if (entity == null) return null;

        BigDecimal totalAssets = calculateTotalAssets(entity);

        return ZakahIndividualRecordSummaryResponse.builder()
                .id(entity.getId())
                .status(entity.getStatus())
                .zakahAmount(entity.getZakahAmount())
                .calculationDate(entity.getCalculationDate())
                .build();
    }

    // ================= HELPER METHODS =================
    private BigDecimal calculateTotalAssets(ZakahIndividualRecord entity) {
        return nullToZero(entity.getCash())
                .add(nullToZero(entity.getGold()))
                .add(nullToZero(entity.getSilver()))
                .add(nullToZero(entity.getStocks()))
                .add(nullToZero(entity.getBonds()))
                .add(nullToZero(entity.getTradeOffers()))
                .add(nullToZero(entity.getJewelry()))
                .add(nullToZero(entity.getOtherAssets()));

    }

    private BigDecimal calculateTotalLiabilities(ZakahIndividualRecord entity) {
        return nullToZero(entity.getLoans())
                .add(nullToZero(entity.getDebt()));
    }

    private BigDecimal nullToZero(BigDecimal value) {
        return Optional.ofNullable(value).orElse(BigDecimal.ZERO);
    }
}
