package com.example.reactserver.Repositories;

// Imports 
// ===============================================================================================================================================
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.reactserver.Entities.Category;

// Class 
// ===============================================================================================================================================
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
