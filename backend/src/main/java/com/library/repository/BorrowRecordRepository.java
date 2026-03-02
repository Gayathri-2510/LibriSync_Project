package com.library.repository;

import com.library.entity.BorrowRecord;
import com.library.entity.BorrowStatus;
import com.library.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUser(User user);
    List<BorrowRecord> findByStatus(BorrowStatus status);
    List<BorrowRecord> findByUserAndStatus(User user, BorrowStatus status);
    long countByStatus(BorrowStatus status);
}
