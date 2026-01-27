package com.example.reactserver.Services;

// Imports 
// ===============================================================================================================================================
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.reactserver.DTOs.RequestDTO;
import com.example.reactserver.DTOs.RequestFileDTO;
import com.example.reactserver.DTOs.UpdateRequest;
import com.example.reactserver.Entities.Request;
import com.example.reactserver.Entities.RequestFile;
import com.example.reactserver.Entities.User;
import com.example.reactserver.Enumeration.RequestStatus;
import com.example.reactserver.Repositories.CategoryRepository;
import com.example.reactserver.Repositories.RequestFileRepository;
import com.example.reactserver.Repositories.RequestRepository;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Class
// ===============================================================================================================================================
@Service
@Transactional
public class RequestService {

    // Properties
    // ----------------------------------------------------------------------------------------------------------------
    private final RequestRepository requestRepository;
    private final CategoryRepository categoryRepository;
    private final RequestFileRepository requestFileRepository;
    private final FileStorageService fileStorageService;

    // Constructor
    // ----------------------------------------------------------------------------------------------------------------
    public RequestService(RequestRepository requestRepository, CategoryRepository categoryRepository,
            RequestFileRepository requestFileRepository, FileStorageService fileStorageService) {
        this.requestRepository = requestRepository;
        this.categoryRepository = categoryRepository;
        this.requestFileRepository = requestFileRepository;
        this.fileStorageService = fileStorageService;
    }

    // Create Request
    // ----------------------------------------------------------------------------------------------------------------
    public void createRequest(int categoryId, String description, List<MultipartFile> files, User currentUser) {

        // Create Request Object
        Request request = new Request();
        request.setDescription(description);
        request.setUser(currentUser);
        request.setStatus(RequestStatus.NEW);
        request.setCategory(
                categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid category")));

        // Save Request in DB
        requestRepository.save(request);

        // Check for Files
        if (files == null || files.isEmpty()) {
            return;
        }

        // For every file found
        for (MultipartFile file : files) {
            // Store it in the server storage
            String storedPath = fileStorageService.store(file);

            // Make a RequestFile object
            RequestFile rf = new RequestFile();
            rf.setRequest(request);
            rf.setFilename(file.getOriginalFilename());
            rf.setPath(storedPath);

            // Save it in DB
            requestFileRepository.save(rf);
        }
    }

    // Get Requests for User
    // ----------------------------------------------------------------------------------------------------------------
    public List<RequestDTO> getRequestsForUser(User user, RequestStatus excludeStatus) {

        List<Request> requests;
        if (excludeStatus == null) {
            requests = requestRepository.findByUser(user);
        } else {
            requests = requestRepository.findByUserAndStatusNot(user, excludeStatus);
        }

        return requests
                .stream()
                .map(request -> {

                    // Find all files related to the request
                    List<RequestFileDTO> files = request.getFiles()
                            .stream()
                            .map(f -> new RequestFileDTO(
                                    f.getId(),
                                    f.getFilename(),
                                    "/api/files/" + f.getId()))
                            .toList();

                    // Create the DTO for the Request
                    return (new RequestDTO(request.getId(), request.getDescription(),
                            request.getCategory().getName(), request.getStatus().getLabel(),
                            request.getComments(), request.getActions(), request.getTechnician(),
                            request.getCreatedAt(), files));
                }).toList();
    }

    // Get All Requests
    // ----------------------------------------------------------------------------------------------------------------
    public List<RequestDTO> getAllRequests() {
        return requestRepository.findAll()
                .stream()
                .map(request -> {

                    // Find all files related to the request
                    List<RequestFileDTO> files = request.getFiles()
                            .stream()
                            .map(f -> new RequestFileDTO(
                                    f.getId(),
                                    f.getFilename(),
                                    "/api/files/" + f.getId()))
                            .toList();

                    // Create the DTO for the Request
                    return (new RequestDTO(request.getId(), request.getDescription(),
                            request.getCategory().getName(), request.getStatus().getLabel(),
                            request.getComments(), request.getActions(), request.getTechnician(),
                            request.getCreatedAt(), files));
                }).toList();
    }

    // Update Request
    // ----------------------------------------------------------------------------------------------------------------
    public void updateRequest(UpdateRequest updateRequest) {
        Request request = requestRepository.findById(updateRequest.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Request not found"));

        request.setStatus(RequestStatus.valueOf(updateRequest.getStatus()));
        request.setActions(updateRequest.getActions());
        request.setComments(updateRequest.getComments());
        request.setTechnician(updateRequest.getTechnician());

        requestRepository.save(request);
    }

}
