package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.reactserver.DTOs.CategoryDTO;
import com.example.reactserver.Repositories.CategoryRepository;
import com.example.reactserver.Entities.Category;
import com.example.reactserver.Enumeration.Priority;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

// Class
// ===============================================================================================================================================
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private final CategoryRepository categoryRepository;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Get Categories Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryDTO(category.getId(),
                        category.getName(), category.getDescription(), category.getPriority().name()))
                .toList();
    }

    // Update Category Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ResponseEntity<Void> updateCategory(@RequestBody CategoryDTO categoryDTO) {

        // Find Category
        Category category = categoryRepository.findById(categoryDTO.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Update Category
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setPriority(Priority.valueOf(categoryDTO.getPriority()));

        // Update DB
        categoryRepository.save(category);

        // Respond to the Client
        return ResponseEntity.ok().build();
    }

    // Delete Category Endpoint
    // ----------------------------------------------------------------------------------------------------------------//
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {

        // Check if the category exists
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        // Delete the Category
        categoryRepository.deleteById(id);

        // Respond to the Client
        return ResponseEntity.noContent().build();
    }

    // Create Category Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Void> postMethodName(@RequestBody CategoryDTO categoryDTO) {

        // Create new Category
        Category category = new Category(categoryDTO.getName(), categoryDTO.getDescription(),
                Priority.valueOf(categoryDTO.getPriority()));

        // Save Category in DB
        categoryRepository.save(category);

        // Respond to the Client
        return ResponseEntity.ok().build();
    }

}
