package com.example.reactserver.DTOs;

// Class 
// ===============================================================================================================================================
public class LoginRequest {

    // Properties
    // -----------------------------------------------------------------------------------------------------------------
    private String email;
    private String password;

    // Constructors
    // -----------------------------------------------------------------------------------------------------------------
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Setters & Getters
    // -----------------------------------------------------------------------------------------------------------------
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}