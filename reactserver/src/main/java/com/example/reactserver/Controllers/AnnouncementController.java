package com.example.reactserver.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reactserver.Entities.Announcement;
import com.example.reactserver.Repositories.AnnouncementRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    // Properties
    private AnnouncementRepository announcementRepository;

    // Constructor
    public AnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    // Create Announcement Endpoint
    @PostMapping
    public ResponseEntity<Void> createAnnouncement(@RequestBody Announcement announcement) {

        announcementRepository.save(announcement);

        // Respond to the Client
        return ResponseEntity.ok().build();
    }

}
