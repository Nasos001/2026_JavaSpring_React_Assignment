package com.example.reactserver.DTOs;

// AuthResponse Class ============================================================================================
public class AuthResponse {
    // Properties -------------------------------------------------
    private String message;
    private String role;

    // Constructor ------------------------------------------------
    public AuthResponse(String message) {
        this.message = message;
    }

    public AuthResponse(String message, String role) {
        this.message = message;
        this.role = role;
    }

    // Message ----------------------------------------------------
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}