package com.example.reactserver.DTOs;

// Class 
// ===============================================================================================================================================
public class CategoryDTO {

    // Properties
    // -----------------------------------------------------------------------------------------------------------------
    private int id;
    private String name;
    private String description;
    private String priority;

    // Constructor
    // -----------------------------------------------------------------------------------------------------------------
    public CategoryDTO(int id, String name, String description, String priority) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priority = priority;
    }

    // Setters and Getters
    // -----------------------------------------------------------------------------------------------------------------
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
