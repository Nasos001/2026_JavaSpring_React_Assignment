package com.example.reactserver.DTOs;

public class RegisterRequest {

    // Properties
    String name;
    String surname;
    String country;
    String city;
    String address;
    String username;
    String email;
    String password;

    // Constructors
    public RegisterRequest() {
    }

    public RegisterRequest(String name, String surname, String country, String city, String address, String username,
            String email, String password) {
        this.name = name;
        this.surname = surname;
        this.country = country;
        this.city = city;
        this.address = address;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Setters & Getters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

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
