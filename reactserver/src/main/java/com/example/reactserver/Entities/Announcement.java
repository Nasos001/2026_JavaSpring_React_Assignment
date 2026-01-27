package com.example.reactserver.Entities;

// Imports 
// ===============================================================================================================================================
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

// Class 
// ===============================================================================================================================================
@Entity
@Table(name = "announcements")
public class Announcement {

    // Properties
    // -----------------------------------------------------------------------------------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    // Constructor
    // -----------------------------------------------------------------------------------------------------------------
    public Announcement(String title, String content) {
        this.title = title;
        this.content = content;
    }

    // Setters & Getters
    // -----------------------------------------------------------------------------------------------------------------
    public Announcement() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
