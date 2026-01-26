package com.example.reactserver.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reactserver.Entities.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {
}