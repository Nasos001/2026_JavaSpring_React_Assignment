package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.reactserver.DTOs.AuthResponse;
import com.example.reactserver.DTOs.LoginRequest;
import com.example.reactserver.DTOs.RegisterRequest;
import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.UserRole;
import com.example.reactserver.Repositories.UserRepository;
import com.example.reactserver.Services.JwtService;

import java.util.Optional;

// Class
// ===============================================================================================================================================
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private JwtService jwtService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public AuthController(JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Login Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        // Check Credentials in the DB
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            // Get User
            User user = userOpt.get();

            // Check Password given to the one stored
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

                // Create JWT
                String token = jwtService.generateToken(user.getEmail());

                // Create Cookie for storage
                Cookie cookie = new Cookie("authToken", token);
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                cookie.setMaxAge(7 * 24 * 60 * 60);

                // Add cookie to response
                response.addCookie(cookie);
                return ResponseEntity.ok(new AuthResponse("Login successful", user.getRole().name()));
            }
        }

        // Catch Error
        return ResponseEntity.status(401).body(new AuthResponse("Invalid credentials"));
    }

    // Logout Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'USER', 'NOT_DETERMINED')")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Create expired Cookie
        Cookie cookie = new Cookie("authToken", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        // Set it on the Web
        response.addCookie(cookie);

        // Respond to the Client
        return ResponseEntity.ok(new AuthResponse("Logged out successfully"));
    }

    // Register Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(Authentication authentication, @RequestBody RegisterRequest registerRequest) {

        boolean isAuthenticated = authentication != null &&
                authentication.isAuthenticated() &&
                !authentication.getPrincipal().equals("anonymousUser");

        // Check if user is authenticated (logged in)
        if (isAuthenticated) {

            // Check if the authenticated user is an ADMIN
            boolean isAdmin = authentication.getAuthorities()
                    .stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            // If not admin, they shouldn't be creating users while logged in
            if (!isAdmin) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(new AuthResponse("You cannot register while logged in"));
            }
        }

        // Check if User already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new AuthResponse("Email already exists"));
        }

        // Create new User
        User newUser = new User(
                registerRequest.getName(),
                registerRequest.getSurname(),
                registerRequest.getCountry(),
                registerRequest.getCity(),
                registerRequest.getAddress(),
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                UserRole.NOT_DETERMINED);

        // Save User in the DB
        userRepository.save(newUser);

        // Respond to the Client
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse("Registration successful"));
    }

    // Check Login Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(@CookieValue(value = "authToken", required = false) String token) {

        // Validate token
        if (token != null && jwtService.validateToken(token)) {

            // Get User email
            String email = jwtService.getEmailFromToken(token);

            // Find User
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException("User not found"));

            // Respond to the client
            return ResponseEntity.ok(new AuthResponse("Authenticated", user.getRole().name()));
        }

        return ResponseEntity.status(401).body(new AuthResponse("Not authenticated"));
    }

}