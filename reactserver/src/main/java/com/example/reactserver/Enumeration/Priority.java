package com.example.reactserver.Enumeration;

// Enumeration
// ===============================================================================================================================================
public enum Priority {
    // Objects
    // -----------------------------------------------------------------------------
    HIGH("High"),
    MEDIUM("Medium"),
    LOW("Low");

    // Properties
    // -----------------------------------------------------------------------------
    private String label;

    // Constructor
    // -----------------------------------------------------------------------------
    Priority(String label) {
        this.label = label;
    }

    // Setters & Getters
    // -----------------------------------------------------------------------------
    public String getLabel() {
        return label;
    }
}
