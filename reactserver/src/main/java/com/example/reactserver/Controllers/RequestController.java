package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.reactserver.DTOs.RequestDTO;
import com.example.reactserver.DTOs.UpdateRequest;
import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.RequestStatus;
import com.example.reactserver.Repositories.UserRepository;
import com.example.reactserver.Services.JwtService;
import com.example.reactserver.Services.RequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import java.util.List;

// Class
// ===============================================================================================================================================
@RestController
@RequestMapping("/api/requests")
public class RequestController {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private final RequestService requestService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public RequestController(RequestService requestService, UserRepository userRepository, JwtService jwtService) {
        this.requestService = requestService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // Create Request Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('USER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createRequest(
            @RequestParam("categoryId") String categoryIdStr,
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @CookieValue("authToken") String token) {

        // Convert Category to Int
        Integer categoryId;
        try {
            categoryId = Integer.valueOf(categoryIdStr);
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid category ID");
        }

        // Find current User
        String email = jwtService.getEmailFromToken(token);
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Save Request
        requestService.createRequest(categoryId, description, files, currentUser);

        // Respond to the Client
        return ResponseEntity.ok().build();
    }

    // Get Requests Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN','USER')")
    @GetMapping
    public List<RequestDTO> getRequests(
            Authentication authentication,
            @RequestParam(required = false) RequestStatus excludeStatus,
            @RequestParam(defaultValue = "false") boolean all) {

        // Check if the User wants all requests
        if (all) {
            // Check if the User is a simple User
            if (!authentication.getAuthorities()
                    .stream()
                    .anyMatch(
                            a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_TECHNICIAN"))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }

            // Otherwise, return all requests
            return requestService.getAllRequests();
        }

        // Otherwise, get requests minus the explicit status
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return requestService.getRequestsForUser(user, excludeStatus);
    }

    // Update Request Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    @PutMapping
    public ResponseEntity<Void> updateRequest(@RequestBody UpdateRequest updateRequest) {

        // Update Service
        requestService.updateRequest(updateRequest);

        // Respond to Client
        return ResponseEntity.ok().build();
    }
}
