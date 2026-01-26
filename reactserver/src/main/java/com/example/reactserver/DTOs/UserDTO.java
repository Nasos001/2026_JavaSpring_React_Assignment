package com.example.reactserver.DTOs;

import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.UserRole;

public class UserDTO {
    // Properties
    // -------------------------------------------------------------------------------------
    private int id;
    private String name;
    private String surname;
    private String country;
    private String city;
    private String address;
    private String username;
    private String email;
    private String role;

    // Constructors
    // -------------------------------------------------------------------------------------
    public UserDTO(int id, String name, String surname, String country, String city, String address, String username,
            String email, UserRole role) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.country = country;
        this.city = city;
        this.address = address;
        this.username = username;
        this.email = email;
        this.role = role.name();
    }

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.country = user.getCountry();
        this.city = user.getCity();
        this.address = user.getAddress();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole().name();
    }

    public UserDTO() {
    }

    // Setters & Getters
    // -------------------------------------------------------------------------------------
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}
