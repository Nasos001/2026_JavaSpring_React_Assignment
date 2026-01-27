package com.example.reactserver.Services;

// Imports 
// ===============================================================================================================================================
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

// Class
// ===============================================================================================================================================
@Service
public class FileStorageService {

    // Properties
    // ---------------------------------------------------------------------------------------------
    private final Path storageLocation;

    // Constructor
    // ---------------------------------------------------------------------------------------------
    public FileStorageService() {
        // Determine path
        this.storageLocation = Paths.get("uploads").toAbsolutePath().normalize();

        // Attempt to create the folder
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create storage directory", e);
        }
    }

    // File storage Endpoint
    // ---------------------------------------------------------------------------------------------
    public String store(MultipartFile file) {
        try {
            // Check for Empty Files
            if (file.isEmpty()) {
                throw new RuntimeException("Cannot store empty file");
            }

            // Normalize file name to avoid bad paths
            String originalFilename = Paths.get(file.getOriginalFilename()).getFileName().toString();

            // Generate a unique filename
            String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;

            // Target path
            Path target = this.storageLocation.resolve(uniqueFilename);

            // Copy the file to the target location
            Files.copy(file.getInputStream(), target);

            // Return the relative path to store in DB
            return uniqueFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    // Load File
    // ---------------------------------------------------------------------------------------------
    public Resource loadAsResource(String path) {
        try {
            // Create path to file (base location + fileName)
            Path filePath = storageLocation.resolve(path).normalize();

            // Create file Resource
            Resource resource = new UrlResource(filePath.toUri());

            // Check for Errors
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not found or not readable");
            }

            // Return it
            return resource;

        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid file path", e);
        }
    }
}
