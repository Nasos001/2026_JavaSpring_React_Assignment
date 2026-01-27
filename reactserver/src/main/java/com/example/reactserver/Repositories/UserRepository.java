package com.example.reactserver.Repositories;

// Imports 
// ===============================================================================================================================================
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.UserRole;

import java.util.Optional;
import java.util.List;

// Class 
// ===============================================================================================================================================
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findById(Integer id);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    long countByRole(UserRole admin);
}
