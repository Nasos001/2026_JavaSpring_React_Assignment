package com.example.reactserver.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reactserver.Entities.RequestFile;

public interface RequestFileRepository extends JpaRepository<RequestFile, Long> {
}
