package com.example.reactserver.Repositories;

// Imports 
// ===============================================================================================================================================
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.reactserver.Entities.RequestFile;

// Class 
// ===============================================================================================================================================
public interface RequestFileRepository extends JpaRepository<RequestFile, Long> {
}
