package com.library;

import com.library.entity.Book;
import com.library.entity.User;
import com.library.entity.Role;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class LibraryManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryManagementApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UserRepository userRepo, BookRepository bookRepo, PasswordEncoder encoder) {
        return args -> {
            // Create admin
            if (userRepo.findByEmail("admin@library.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@library.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepo.save(admin);
            }

            // Create sample user
            if (userRepo.findByEmail("user@library.com").isEmpty()) {
                User user = new User();
                user.setName("John Doe");
                user.setEmail("user@library.com");
                user.setPassword(encoder.encode("user123"));
                user.setRole(Role.USER);
                userRepo.save(user);
            }

            // Create sample books
            if (bookRepo.count() == 0) {
                List<Book> books = List.of(
                    createBook("The Great Gatsby", "F. Scott Fitzgerald", "Fiction", "978-0743273565", 5, "A story of wealth and love in the Jazz Age."),
                    createBook("To Kill a Mockingbird", "Harper Lee", "Fiction", "978-0061935466", 3, "A tale of racial injustice in the American South."),
                    createBook("1984", "George Orwell", "Dystopian", "978-0451524935", 4, "A chilling vision of a totalitarian future."),
                    createBook("Clean Code", "Robert C. Martin", "Technology", "978-0132350884", 6, "Best practices for writing maintainable code."),
                    createBook("The Pragmatic Programmer", "David Thomas", "Technology", "978-0135957059", 2, "Tips for becoming a better programmer."),
                    createBook("Harry Potter and the Philosopher's Stone", "J.K. Rowling", "Fantasy", "978-0439708180", 7, "A young wizard discovers his magical heritage."),
                    createBook("The Hobbit", "J.R.R. Tolkien", "Fantasy", "978-0547928227", 4, "A hobbit embarks on an unexpected journey."),
                    createBook("Sapiens", "Yuval Noah Harari", "History", "978-0062316097", 5, "A brief history of humankind."),
                    createBook("Atomic Habits", "James Clear", "Self-Help", "978-0735211292", 8, "Tiny changes that lead to remarkable results."),
                    createBook("The Da Vinci Code", "Dan Brown", "Thriller", "978-0307474278", 3, "A mystery involving secret societies and art.")
                );
                bookRepo.saveAll(books);
            }
        };
    }

    private Book createBook(String title, String author, String genre, String isbn, int copies, String description) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setGenre(genre);
        book.setIsbn(isbn);
        book.setTotalCopies(copies);
        book.setAvailableCopies(copies);
        book.setDescription(description);
        book.setPublishedDate(LocalDate.of(2020, 1, 1));
        return book;
    }
}
