package com.example.reactserver.Enumeration;

// Enumeration
// ===============================================================================================================================================
public enum RequestStatus {
    // Objects
    // -----------------------------------------------------------------------------
    NEW("New"),
    IN_PROGRESS("In progress"),
    COMPLETED("Completed");

    // Properties
    // -----------------------------------------------------------------------------
    private final String label;

    // Constructor
    // -----------------------------------------------------------------------------
    RequestStatus(String label) {
        this.label = label;
    }

    // Setters & Getters
    // -----------------------------------------------------------------------------
    public String getLabel() {
        return label;
    }
}
