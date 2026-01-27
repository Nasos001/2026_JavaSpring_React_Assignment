package com.example.reactserver.Enumeration;

// Enumeration
// ===============================================================================================================================================
public enum UserRole {
    // Objects
    // -----------------------------------------------------------------------------
    NOT_DETERMINED("Not Determined"),
    USER("User"),
    TECHNICIAN("Technician"),
    ADMIN("Admin");

    // Properties
    // -----------------------------------------------------------------------------
    private String label;

    // Constructor
    // -----------------------------------------------------------------------------
    UserRole(String label) {
        this.label = label;
    }

    // Setters & Getters
    // -----------------------------------------------------------------------------
    public String getLabel() {
        return label;
    }
}
