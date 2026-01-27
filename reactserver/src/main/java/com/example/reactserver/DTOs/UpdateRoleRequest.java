package com.example.reactserver.DTOs;

// Class 
// ===============================================================================================================================================
public class UpdateRoleRequest {

    // Properties
    // -----------------------------------------------------------------------------------------------------------------
    private Integer id;
    private String role;

    // Constructors
    // -----------------------------------------------------------------------------------------------------------------
    public UpdateRoleRequest(Integer id, String role) {
        this.id = id;
        this.role = role;
    }

    // Setters & Getters
    // -----------------------------------------------------------------------------------------------------------------
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}
