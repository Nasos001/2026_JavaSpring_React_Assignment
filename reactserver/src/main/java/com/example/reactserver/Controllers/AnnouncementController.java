package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reactserver.Entities.Announcement;
import com.example.reactserver.Repositories.AnnouncementRepository;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

// Class
// ===============================================================================================================================================
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private AnnouncementRepository announcementRepository;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public AnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    // Create Announcement Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    /**
     * Creates a new announcement.
     * Requires ADMIN role.
     * 
     * @param announcement the announcement to create
     * @return ResponseEntity indicating success
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Void> createAnnouncement(@RequestBody Announcement announcement) {

        // Save Announcement
        announcementRepository.save(announcement);

        // Respond to the Client
        return ResponseEntity.ok().build();
    }

    // Get Announcements Endpoint
    // ----------------------------------------------------------------------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'USER')")
    @GetMapping
    public List<Announcement> getAnnouncements() {

        // Return all Announcements
        return announcementRepository.findAll();
    }

}
