package com.seasonalservices.controller;

import com.seasonalservices.entities.ServiceEntity;
import com.seasonalservices.service.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getAllServices() {
        List<ServiceEntity> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntity> getServiceById(@PathVariable int id) {
        ServiceEntity service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    @PostMapping
    public ResponseEntity<Integer> addService(@RequestBody ServiceEntity service) {
        int rowsAffected = serviceService.addService(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(rowsAffected);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateService(@PathVariable int id, @RequestBody ServiceEntity service) {
        service.setId(id);
        int rowsAffected = serviceService.updateService(service);
        return ResponseEntity.ok(rowsAffected);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteService(@PathVariable int id) {
        int rowsAffected = serviceService.deleteService(id);
        return ResponseEntity.ok(rowsAffected);
    }
}
