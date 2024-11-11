package com.seasonalservices.service;

import java.util.List;

import com.seasonalservices.entities.ServiceEntity;

public interface ServiceService {
	List<ServiceEntity> getAllServices();

	ServiceEntity getServiceById(int id);

	int addService(ServiceEntity service);

	int updateService(ServiceEntity service);

	int deleteService(int id);
}
