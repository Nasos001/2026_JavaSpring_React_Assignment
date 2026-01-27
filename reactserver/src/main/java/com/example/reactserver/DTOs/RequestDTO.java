package com.example.reactserver.DTOs;

// Imports
// ===============================================================================================================================================
import java.time.LocalDateTime;
import java.util.List;

// Class 
// ===============================================================================================================================================
public class RequestDTO {

    // Properties
    // -----------------------------------------------------------------------------------------------------------------
    private Integer id;
    private String description;
    private String categoryName;
    private String status;
    private String comments;
    private String actions;
    private Integer technician;
    private LocalDateTime createdAt;
    private List<RequestFileDTO> files;

    // Constructors
    // -----------------------------------------------------------------------------------------------------------------
    public RequestDTO(Integer id, String description, String categoryName, String status, String comments,
            String actions, Integer technician, LocalDateTime createdAt, List<RequestFileDTO> files) {
        this.id = id;
        this.description = description;
        this.categoryName = categoryName;
        this.status = status;
        this.comments = comments;
        this.actions = actions;
        this.technician = technician;
        this.createdAt = createdAt;
        this.files = files;
    }

    // Setters & Getters
    // -----------------------------------------------------------------------------------------------------------------
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public List<RequestFileDTO> getFiles() {
        return files;
    }

    public Integer getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getActions() {
        return actions;
    }

    public void setActions(String actions) {
        this.actions = actions;
    }

    public Integer getTechnician() {
        return technician;
    }

    public void setTechnician(Integer technician) {
        this.technician = technician;
    }

    public void setFiles(List<RequestFileDTO> files) {
        this.files = files;
    }
}
