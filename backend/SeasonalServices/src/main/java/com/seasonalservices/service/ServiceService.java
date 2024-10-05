package com.seasonalservices.service;

import com.seasonalservices.entities.ServiceEntity;

import java.util.List;

public interface ServiceService {
    List<ServiceEntity> getAllServices();
    ServiceEntity getServiceById(int id);
    int addService(ServiceEntity service);
    int updateService(ServiceEntity service);
    int deleteService(int id);
}
