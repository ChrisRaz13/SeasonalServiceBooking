package com.seasonalservices.entities;

public class ServiceEntity {
	private int id;
	private String serviceName;
	private String description;
	private Double basePrice;

	public ServiceEntity() {
	}

	public ServiceEntity(int id, String serviceName, String description, double basePrice) {
		this.id = id;
		this.serviceName = serviceName;
		this.description = description;
		this.basePrice = basePrice;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(Double basePrice) {
		this.basePrice = basePrice;
	}
}
