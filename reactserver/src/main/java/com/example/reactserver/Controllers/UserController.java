package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.reactserver.DTOs.UpdateRoleRequest;
import com.example.reactserver.DTOs.UserDTO;
import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.UserRole;
import com.example.reactserver.Repositories.RequestRepository;
import com.example.reactserver.Repositories.UserRepository;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Class
// ===============================================================================================================================================
@RestController
@RequestMapping("api/users")
public class UserController {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private UserRepository userRepository;
    private RequestRepository requestRepository;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public UserController(UserRepository userRepository, RequestRepository requestRepository) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
    }

    // Get Users Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    @GetMapping
    public List<UserDTO> getUsers(
            Authentication authentication,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer id) {

        // Is the client a Technician?
        boolean isTechnician = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICIAN"));

        // Check if a Technician wants a User by ID
        if (isTechnician && id != null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Technicians may only query users by role");
        }

        // Fetch by ID
        if (id != null) {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            return List.of(new UserDTO(user));
        }

        // Fetch by Role
        if (role != null) {
            // Technicians can only fetch TECHNICIAN users
            if (isTechnician && !role.equals("TECHNICIAN")) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Technicians may only query users with role TECHNICIAN");
            }

            // Find Users based on Role
            return userRepository.findByRole(UserRole.valueOf(role))
                    .stream()
                    .map(UserDTO::new)
                    .toList();
        }

        // Throw error otherwise
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Either 'role' or 'id' must be provided");
    }

    // Update User Role Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/role")
    public ResponseEntity<Void> updateRole(@RequestBody UpdateRoleRequest request) {

        // Find User
        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Set new role
        user.setRole(UserRole.valueOf(request.getRole()));

        // Save the User in DB
        userRepository.save(user);

        // Respond to the Client
        return ResponseEntity.ok().build();
    }

    // Update User Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user")
    public ResponseEntity<Void> updateUser(@RequestBody UserDTO userDTO) {

        // Find User
        User user = userRepository.findById(userDTO.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Update User Info
        user.setName(userDTO.getName());
        user.setSurname(userDTO.getSurname());
        user.setCountry(userDTO.getCountry());
        user.setCity(userDTO.getCity());
        user.setAddress(userDTO.getAddress());
        user.setUsername(userDTO.getUsername());
        user.setRole(UserRole.valueOf(userDTO.getRole()));

        // Save User in DB
        userRepository.save(user);

        // Respond to the Client
        return ResponseEntity.ok().build();
    }

    // Delete User Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {

        // Find the user
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Check if user is ADMIN
        if (user.getRole() == UserRole.ADMIN) {
            // Count how many admins exist
            long adminCount = userRepository.countByRole(UserRole.ADMIN);

            if (adminCount <= 1) {
                // Cannot delete the last remaining admin
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Cannot delete the last remaining ADMIN");
            }
        }

        // Delete all requests associated with this user
        requestRepository.deleteByUser(user);

        // Delete the user
        userRepository.delete(user);

        return ResponseEntity.noContent().build();
    }
}
