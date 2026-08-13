package com.example.studentmanagement.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JwtServiceTest {

    private JwtService jwtService;

    private UserDetails studentUser;
    private UserDetails adminUser;

    @BeforeEach
    void setUp() {

        String testSecret =
                "student-management-super-secret-jwt-key-2026";

        long expirationTime =
                1000 * 60 * 60;

        jwtService = new JwtService(
                testSecret,
                expirationTime
        );

        studentUser = User.builder()
                .username("student")
                .password("student123")
                .roles("USER")
                .build();

        adminUser = User.builder()
                .username("admin")
                .password("admin123")
                .roles("ADMIN")
                .build();
    }

    @Test
    void generateTokenShouldCreateToken() {

        String token =
                jwtService.generateToken(studentUser);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void extractUsernameShouldReturnCorrectUsername() {

        String token =
                jwtService.generateToken(studentUser);

        String username =
                jwtService.extractUsername(token);

        assertEquals(
                "student",
                username
        );
    }

    @Test
    void tokenShouldBeValidForCorrectUser() {

        String token =
                jwtService.generateToken(studentUser);

        boolean valid =
                jwtService.isTokenValid(
                        token,
                        studentUser
                );

        assertTrue(valid);
    }

    @Test
    void tokenShouldBeInvalidForDifferentUser() {

        String token =
                jwtService.generateToken(studentUser);

        boolean valid =
                jwtService.isTokenValid(
                        token,
                        adminUser
                );

        assertFalse(valid);
    }
}