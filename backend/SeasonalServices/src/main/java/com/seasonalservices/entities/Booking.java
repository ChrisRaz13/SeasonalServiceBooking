package com.seasonalservices.entities;

import java.time.LocalDateTime;

public class Booking {
    private int id;
    private int clientId;
    private int serviceId;
    private LocalDateTime bookingDateTime;
    private String status;
    private ServiceEntity service;

    public Booking() {}

    public Booking(int id, int clientId, int serviceId, LocalDateTime bookingDateTime, String status) {
        this.id = id;
        this.clientId = clientId;
        this.serviceId = serviceId;
        this.bookingDateTime = bookingDateTime;
        this.status = status;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
 
    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

    public LocalDateTime getBookingDateTime() {
        return bookingDateTime;
    }

    public void setBookingDateTime(LocalDateTime bookingDateTime) {
        this.bookingDateTime = bookingDateTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

	public ServiceEntity getService() {
		return service;
	}

	public void setService(ServiceEntity service) {
		this.service = service;
	}
}
