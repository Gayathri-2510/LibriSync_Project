package com.library.service;

import com.library.entity.*;
import com.library.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BorrowService {

    @Autowired private BorrowRecordRepository borrowRepo;
    @Autowired private BookRepository bookRepo;
    @Autowired private UserRepository userRepo;

    public BorrowRecord borrowBook(Long userId, Long bookId) {
        User user = userRepo.findById(userId).orElseThrow();
        Book book = bookRepo.findById(bookId).orElseThrow();

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No copies available");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepo.save(book);

        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));
        record.setStatus(BorrowStatus.BORROWED);
        return borrowRepo.save(record);
    }

    public BorrowRecord returnBook(Long recordId) {
        BorrowRecord record = borrowRepo.findById(recordId).orElseThrow();
        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowStatus.RETURNED);

        // Calculate fine: $1 per day overdue
        if (LocalDate.now().isAfter(record.getDueDate())) {
            long overdueDays = ChronoUnit.DAYS.between(record.getDueDate(), LocalDate.now());
            record.setFine(overdueDays * 1.0);
        }

        // Return copy to book
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepo.save(book);

        return borrowRepo.save(record);
    }

    public List<BorrowRecord> getUserRecords(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return borrowRepo.findByUser(user);
    }

    public List<BorrowRecord> getAllRecords() {
        return borrowRepo.findAll();
    }

    public List<BorrowRecord> getOverdueRecords() {
        return borrowRepo.findByStatus(BorrowStatus.BORROWED).stream()
            .filter(r -> LocalDate.now().isAfter(r.getDueDate()))
            .toList();
    }
}
