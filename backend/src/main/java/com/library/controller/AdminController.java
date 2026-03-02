package com.library.controller;

import com.library.entity.BorrowStatus;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private UserRepository userRepo;
    @Autowired private BookRepository bookRepo;
    @Autowired private BorrowRecordRepository borrowRepo;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userRepo.count();
        long totalBooks = bookRepo.count();
        long borrowedBooks = borrowRepo.countByStatus(BorrowStatus.BORROWED);
        long returnedBooks = borrowRepo.countByStatus(BorrowStatus.RETURNED);

        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "totalBooks", totalBooks,
            "borrowedBooks", borrowedBooks,
            "returnedBooks", returnedBooks
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }
}
