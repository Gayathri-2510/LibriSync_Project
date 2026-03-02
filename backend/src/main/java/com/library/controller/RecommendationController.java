package com.library.controller;

import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.BorrowStatus;
import com.library.entity.User;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired private BorrowRecordRepository borrowRepo;
    @Autowired private BookRepository bookRepo;

    @GetMapping
    public List<Book> getRecommendations(@AuthenticationPrincipal User user) {
        // Find user's borrowed genres
        List<BorrowRecord> userRecords = borrowRepo.findByUser(user);

        if (userRecords.isEmpty()) {
            // New user: return popular available books
            return bookRepo.findAll().stream()
                .filter(b -> b.getAvailableCopies() > 0)
                .limit(5)
                .collect(Collectors.toList());
        }

        // Get user's favorite genre
        Map<String, Long> genreCount = userRecords.stream()
            .collect(Collectors.groupingBy(r -> r.getBook().getGenre(), Collectors.counting()));

        String favoriteGenre = genreCount.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("");

        // Get borrowed book IDs
        Set<Long> borrowedIds = userRecords.stream()
            .map(r -> r.getBook().getId())
            .collect(Collectors.toSet());

        // Recommend books from same genre not yet read
        List<Book> recommendations = bookRepo.findByGenreIgnoreCase(favoriteGenre).stream()
            .filter(b -> !borrowedIds.contains(b.getId()) && b.getAvailableCopies() > 0)
            .limit(5)
            .collect(Collectors.toList());

        // If not enough, add from other genres
        if (recommendations.size() < 3) {
            bookRepo.findAll().stream()
                .filter(b -> !borrowedIds.contains(b.getId()) && b.getAvailableCopies() > 0
                    && !recommendations.contains(b))
                .limit(5 - recommendations.size())
                .forEach(recommendations::add);
        }

        return recommendations;
    }
}
