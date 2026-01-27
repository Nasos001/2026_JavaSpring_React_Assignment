package com.example.reactserver.Enumeration;

// Enumeration
// ===============================================================================================================================================
public enum Priority {
    // Objects
    // -----------------------------------------------------------------------------
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High");

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
