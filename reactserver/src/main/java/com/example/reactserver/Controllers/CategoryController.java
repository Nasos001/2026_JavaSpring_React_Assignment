package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.reactserver.DTOs.CategoryDTO;
import com.example.reactserver.Repositories.CategoryRepository;
import com.example.reactserver.Repositories.RequestRepository;
import com.example.reactserver.Entities.Category;
import com.example.reactserver.Entities.Request;
import com.example.reactserver.Enumeration.Priority;
import com.example.reactserver.Enumeration.RequestStatus;

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
    private final RequestRepository requestRepository;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public CategoryController(CategoryRepository categoryRepository, RequestRepository requestRepository) {
        this.categoryRepository = categoryRepository;
        this.requestRepository = requestRepository;
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

        // Find category
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Find requests that reference this category
        List<Request> requestsUsingCategory = requestRepository.findByCategory(category);

        // If there are requests, check if they are all COMPLETED
        boolean hasNonCompleted = requestsUsingCategory.stream()
                .anyMatch(r -> r.getStatus() != RequestStatus.COMPLETED);

        if (hasNonCompleted) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot delete category: it is used in requests that are not completed");
        }

        // If all requests are completed, optionally delete them (cascade)
        if (!requestsUsingCategory.isEmpty()) {
            requestRepository.deleteAll(requestsUsingCategory);
        }

        // Delete the category
        categoryRepository.delete(category);

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
