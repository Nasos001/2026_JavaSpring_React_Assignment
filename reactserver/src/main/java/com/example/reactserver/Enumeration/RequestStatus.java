package com.example.reactserver.Enumeration;

public enum RequestStatus {
    NEW("New"),
    IN_PROGRESS("In progress"),
    COMPLETED("Completed");

    private final String label;

    RequestStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
