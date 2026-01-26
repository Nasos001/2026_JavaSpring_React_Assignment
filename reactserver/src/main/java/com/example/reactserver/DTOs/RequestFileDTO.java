package com.example.reactserver.DTOs;

public class RequestFileDTO {
    private Long id;
    private String filename;
    private String downloadUrl;

    public RequestFileDTO(Long id, String filename, String downloadUrl) {
        this.id = id;
        this.filename = filename;
        this.downloadUrl = downloadUrl;
    }

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
