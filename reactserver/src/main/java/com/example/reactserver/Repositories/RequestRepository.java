package com.example.reactserver.Repositories;

// Imports 
// ===============================================================================================================================================
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.reactserver.Entities.Category;
import com.example.reactserver.Entities.Request;
import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.RequestStatus;

// Class 
// ===============================================================================================================================================
public interface RequestRepository extends JpaRepository<Request, Integer> {
    @Query("""
                SELECT r
                FROM Request r
                JOIN r.category c
                ORDER BY
                    CASE c.priority
                        WHEN 'HIGH' THEN 1
                        WHEN 'MEDIUM' THEN 2
                        WHEN 'LOW' THEN 3
                    END
            """)
    List<Request> findAllOrderByCategoryPriority();

    List<Request> findByUser(User user);

    List<Request> findByUserAndStatusNot(User user, RequestStatus status);

    boolean existsByCategory(Category category);

    List<Request> findByCategory(Category category);

    void deleteByUser(User user);
}
