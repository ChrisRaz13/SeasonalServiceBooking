package com.seasonalservices.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seasonalservices.entities.EmergencyRequest;
import com.seasonalservices.service.EmergencyRequestService;

@RestController
@RequestMapping("/api/emergency-requests")
public class EmergencyRequestController {

    private final EmergencyRequestService service;

    public EmergencyRequestController(EmergencyRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> addEmergencyRequest(@RequestBody EmergencyRequest request) {
        service.addEmergencyRequest(request);
        return ResponseEntity.status(201).build();
    }

    @GetMapping
    public ResponseEntity<List<EmergencyRequest>> getAllEmergencyRequests() {
        List<EmergencyRequest> requests = service.getAllEmergencyRequests();
        return ResponseEntity.ok(requests);
    }

}
