package com.example.reactserver.Repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reactserver.Entities.Request;
import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.RequestStatus;

public interface RequestRepository extends JpaRepository<Request, Integer> {
    List<Request> findByUser(User user);

    List<Request> findByUserAndStatusNot(User user, RequestStatus status);
}
