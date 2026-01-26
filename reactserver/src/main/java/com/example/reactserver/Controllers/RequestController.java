package com.example.reactserver.Controllers;

// Imports ===============================================================================================================================================
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Main Class ============================================================================================================================================
@RestController
@RequestMapping("/api/requests")
public class RequestController {

    // Properties
    // -------------------------------------------------------------------------------------
    private final RequestService requestService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    // Constructor
    // -------------------------------------------------------------------------------------
    public RequestController(RequestService requestService, UserRepository userRepository, JwtService jwtService) {
        this.requestService = requestService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // Create Request Endpoint
    // -------------------------------------------------------------------------------------
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
    // -------------------------------------------------------------------------------------
    @GetMapping
    public List<RequestDTO> getRequests(
            @CookieValue("authToken") String token, @RequestParam(required = false) RequestStatus excludeStatus,
            @RequestParam(required = false) Boolean All) {

        if (All == null) {
            String email = jwtService.getEmailFromToken(token);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED, "User not found"));

            return requestService.getRequestsForUser(user, excludeStatus);
        }

        return requestService.getAllRequests();

    }

    // Update Request Endpoint
    @PutMapping
    public ResponseEntity<Void> updateRequest(@RequestBody UpdateRequest updateRequest) {

        requestService.updateRequest(updateRequest);

        return ResponseEntity.ok().build();
    }
}
