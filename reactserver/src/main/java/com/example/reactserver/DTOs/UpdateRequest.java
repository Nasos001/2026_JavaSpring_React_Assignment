package com.example.reactserver.DTOs;

public class UpdateRequest {
    // Properties
    private Integer id;
    private String status;
    private String actions;
    private String comments;
    private Integer technician;

    // Constructors
    public UpdateRequest(Integer id, String status, String actions, String comments, Integer technician) {
        this.id = id;
        this.status = status;
        this.actions = actions;
        this.comments = comments;
        this.technician = technician;
    }

    public UpdateRequest() {
    }

    // Setters and Getters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getActions() {
        return actions;
    }

    public void setActions(String actions) {
        this.actions = actions;
    }

    public Integer getTechnician() {
        return technician;
    }

    public void setTechnician(Integer technician) {
        this.technician = technician;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
