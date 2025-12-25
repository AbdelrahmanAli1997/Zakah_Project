package ntg.project.ZakahCalculator.service;

import ntg.project.ZakahCalculator.dto.request.ZakahCompanyRecordRequest;
import ntg.project.ZakahCalculator.dto.response.ZakahCompanyRecordResponse;
import ntg.project.ZakahCalculator.entity.ZakahCompanyRecord;

import java.util.List;
import java.util.Optional;

public interface ZakahCompanyRecordService {

    ZakahCompanyRecord save(ZakahCompanyRecord record);

    ZakahCompanyRecord update(ZakahCompanyRecord record, Long id);

    ZakahCompanyRecord findByIdAndUserId(Long id);

    List<ZakahCompanyRecord> findAllByUserId();

    void deleteByIdAndUserId(Long id);

    Optional<ZakahCompanyRecord> findTopByUserIdOrderByBalanceSheetDateDesc(Long userId);
    
    ZakahCompanyRecordResponse calculateZakah(ZakahCompanyRecordRequest request);
}
