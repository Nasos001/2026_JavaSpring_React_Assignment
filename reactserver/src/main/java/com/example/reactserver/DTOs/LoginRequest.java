package com.example.reactserver.DTOs;

// LoginRequest ======================================================================================
public class LoginRequest {
    // Properties -------------------------------------------------
    private String email;
    private String password;

    // Constructor ------------------------------------------------
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Email ------------------------------------------------------
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Password ---------------------------------------------------
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}