package com.library.controller;

import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    @Autowired private BorrowService borrowService;

    @PostMapping("/book/{bookId}")
    public ResponseEntity<?> borrowBook(@PathVariable Long bookId,
                                        @AuthenticationPrincipal User user) {
        try {
            BorrowRecord record = borrowService.borrowBook(user.getId(), bookId);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/return/{recordId}")
    public ResponseEntity<BorrowRecord> returnBook(@PathVariable Long recordId) {
        return ResponseEntity.ok(borrowService.returnBook(recordId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BorrowRecord>> myRecords(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(borrowService.getUserRecords(user.getId()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BorrowRecord>> allRecords() {
        return ResponseEntity.ok(borrowService.getAllRecords());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<BorrowRecord>> overdueRecords() {
        return ResponseEntity.ok(borrowService.getOverdueRecords());
    }
}
