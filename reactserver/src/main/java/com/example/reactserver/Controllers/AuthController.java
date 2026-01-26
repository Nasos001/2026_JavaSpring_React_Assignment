package com.example.reactserver.Controllers;

// Imports ===============================================================================================================================================
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

// Controller ============================================================================================================================================
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Create jwtService object
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
            User user = userOpt.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

                String token = jwtService.generateToken(user.getEmail());
                Cookie cookie = new Cookie("authToken", token);
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                cookie.setMaxAge(7 * 24 * 60 * 60);

                /* TESTING */
                System.out.println("Setting JWT cookie for user: " + user.getEmail());
                System.out.println("Token: " + token);

                response.addCookie(cookie);
                return ResponseEntity.ok(new AuthResponse("Login successful"));
            }
        }

        // Catch Error
        return ResponseEntity.status(401).body(new AuthResponse("Invalid credentials"));
    }

    // Logout Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Create Cookie
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
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new AuthResponse("Email already exists"));
        }

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

        userRepository.save(newUser);

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