package com.seasonalservices.service.impl;

import com.seasonalservices.entities.ServiceEntity;
import com.seasonalservices.repository.ServiceRepository;
import com.seasonalservices.service.ServiceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceServiceImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    @Override
    public ServiceEntity getServiceById(int id) {
        return serviceRepository.findById(id);
    }

    @Override
    public int addService(ServiceEntity service) {
        return serviceRepository.save(service);
    }

    @Override
    public int updateService(ServiceEntity service) {
        return serviceRepository.update(service);
    }

    @Override
    public int deleteService(int id) {
        return serviceRepository.delete(id);
    }
}
