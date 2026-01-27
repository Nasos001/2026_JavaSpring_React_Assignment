package com.example.reactserver.DTOs;

// Class 
// ===============================================================================================================================================
public class RequestFileDTO {

    // Properties
    // -----------------------------------------------------------------------------------------------------------------
    private Long id;
    private String filename;
    private String downloadUrl;

    // Constructor
    // -----------------------------------------------------------------------------------------------------------------
    public RequestFileDTO(Long id, String filename, String downloadUrl) {
        this.id = id;
        this.filename = filename;
        this.downloadUrl = downloadUrl;
    }

    // Setters & Getters
    // -----------------------------------------------------------------------------------------------------------------
    public Long getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }
}
