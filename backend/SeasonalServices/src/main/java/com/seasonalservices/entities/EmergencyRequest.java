package com.seasonalservices.entities;

import java.time.LocalDateTime;

public class EmergencyRequest {
    private Integer id;
    private String name;
    private String phone;
    private String address;
    private String serviceType;
    private String description;
    private LocalDateTime requestTime;

    // Constructors
    public EmergencyRequest() {
    }

    public EmergencyRequest(Integer id, String name, String phone, String address,
                            String serviceType, String description, LocalDateTime requestTime) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.serviceType = serviceType;
        this.description = description;
        this.requestTime = requestTime;
    }

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getServiceType() {
		return serviceType;
	}

	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDateTime getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(LocalDateTime requestTime) {
		this.requestTime = requestTime;
	}

}
