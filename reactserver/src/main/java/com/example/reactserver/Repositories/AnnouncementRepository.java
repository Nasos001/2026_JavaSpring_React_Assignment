package com.example.reactserver.Repositories;

// Imports 
// ===============================================================================================================================================
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reactserver.Entities.Announcement;

// Class 
// ===============================================================================================================================================
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {
}