package ntg.project.ZakahCalculator.repository;

import ntg.project.ZakahCalculator.entity.ZakahCompanyRecord;
import ntg.project.ZakahCalculator.entity.util.ZakahStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ZakahCompanyRecordRepository
        extends JpaRepository<ZakahCompanyRecord, Long> {

    //Get Balance sheet records by user id and year
    ZakahCompanyRecord findByIdAndUserId(Long id, Long userId);

    //Get all balance sheet records by user id
    List<ZakahCompanyRecord> findAllByUserIdOrderByBalanceSheetDateDesc(Long userId);

    //Delete balance sheet record by id and user id
    void deleteByIdAndUserId(Long id,Long userId);

    //Get the latest balance sheet record by user id
    Optional<ZakahCompanyRecord> findTopByUserIdAndStatusInOrderByBalanceSheetDateDesc(Long userId,List<ZakahStatus> statuses);
    Optional<ZakahCompanyRecord> findTopByUserIdOrderByBalanceSheetDateDesc(Long userId);


}
