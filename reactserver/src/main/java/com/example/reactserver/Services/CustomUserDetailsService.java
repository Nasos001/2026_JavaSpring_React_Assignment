package com.example.reactserver.Services;

// Imports 
// ===============================================================================================================================================
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.reactserver.Entities.User;
import com.example.reactserver.Repositories.UserRepository;

// Class
// ===============================================================================================================================================
@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private final UserRepository userRepository;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get User Details
    // ----------------------------------------------------------------------------------------------------------------
    @Override
    public UserDetails loadUserByUsername(String email) {
        // Find User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Return User Details
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
    }
}
