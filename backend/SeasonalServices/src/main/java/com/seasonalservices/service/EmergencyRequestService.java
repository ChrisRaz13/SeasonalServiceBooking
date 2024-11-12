package com.seasonalservices.service;

import com.seasonalservices.entities.EmergencyRequest;
import com.seasonalservices.repository.EmergencyRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyRequestService {

    private final EmergencyRequestRepository repository;

    public EmergencyRequestService(EmergencyRequestRepository repository) {
        this.repository = repository;
    }

    public int addEmergencyRequest(EmergencyRequest request) {
        return repository.save(request);
    }

    public List<EmergencyRequest> getAllEmergencyRequests() {
        return repository.findAll();
    }

}
