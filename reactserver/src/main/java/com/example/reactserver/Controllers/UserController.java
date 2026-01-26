package com.example.reactserver.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.reactserver.DTOs.UpdateRoleRequest;
import com.example.reactserver.DTOs.UserDTO;
import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.UserRole;
import com.example.reactserver.Repositories.UserRepository;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/users")
public class UserController {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private UserRepository userRepository;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get Users Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserDTO> getUsers(@RequestParam(required = false) String role,
            @RequestParam(required = false) Integer id) {

        // Check for specific ID
        if (id != null) {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            return List.of(new UserDTO(user));
        }

        // Check for specific role
        if (role != null) {
            return userRepository.findByRole(UserRole.valueOf(role))
                    .stream()
                    .map(UserDTO::new)
                    .toList();
        }

        // Neither id nor role provided — return 400 Bad Request
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Either 'id' or 'role' must be provided");
    }

    // Update User Role Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/role")
    public ResponseEntity<Void> updateRole(@RequestBody UpdateRoleRequest request) {
        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        user.setRole(UserRole.valueOf(request.getRole()));
        userRepository.save(user);
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

        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
