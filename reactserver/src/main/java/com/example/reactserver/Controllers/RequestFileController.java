package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.reactserver.Entities.RequestFile;
import com.example.reactserver.Repositories.RequestFileRepository;
import com.example.reactserver.Services.FileStorageService;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Class
// ===============================================================================================================================================
@RestController
@RequestMapping("api/files")
public class RequestFileController {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private final RequestFileRepository requestFileRepository;
    private final FileStorageService fileStorageService;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public RequestFileController(RequestFileRepository requestFileRepository, FileStorageService fileStorageService) {
        this.requestFileRepository = requestFileRepository;
        this.fileStorageService = fileStorageService;
    }

    // Download File Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id, @CookieValue("authToken") String token) {

        // Find the RequestFile
        RequestFile file = requestFileRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND));

        // Retrieve the file
        Resource resource = fileStorageService.loadAsResource(file.getPath());

        // Respond to the client
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFilename() + "\"")
                .body(resource);
    }

}
