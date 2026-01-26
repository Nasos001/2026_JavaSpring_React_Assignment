package com.example.reactserver.Services;

import org.springframework.stereotype.Service;

import com.example.reactserver.Repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {
    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private UserRepository userRepository;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get User

}
