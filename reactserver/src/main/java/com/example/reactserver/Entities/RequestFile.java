package com.example.reactserver.Entities;

// Imports ===============================================================================================================================================
import jakarta.persistence.*;

// Main Class ============================================================================================================================================
@Entity
@Table(name = "request_files")
public class RequestFile {

    // Properties
    // -------------------------------------------------------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String path;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;

    // Constructor
    // -------------------------------------------------------------------------------------
    public RequestFile(String filename, String path, Request request) {
        this.filename = filename;
        this.path = path;
        this.request = request;
    }

    public RequestFile() {
    }

    // Getters & Setters
    // -------------------------------------------------------------------------------------
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }
}
