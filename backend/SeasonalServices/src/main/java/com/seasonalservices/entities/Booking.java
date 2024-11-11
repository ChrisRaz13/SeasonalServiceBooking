package com.seasonalservices.entities;

import java.time.LocalDate;
import java.time.LocalTime;

public class Booking {
    private Integer id;
    private Integer clientId;
    private Integer serviceId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String status;
    private String comments;

    // Additional fields from joined tables
    private String serviceName;
    private String clientName;
    private String clientEmail;
    private String clientPhone;

    // Constructors

    public Booking() {
        // Default constructor
    }

    public Booking(Integer id, Integer clientId, Integer serviceId, LocalDate bookingDate, LocalTime bookingTime,
                   String status, String comments, String serviceName, String clientName,
                   String clientEmail, String clientPhone) {
        this.id = id;
        this.clientId = clientId;
        this.serviceId = serviceId;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.status = status;
        this.comments = comments;
        this.serviceName = serviceName;
        this.clientName = clientName;
        this.clientEmail = clientEmail;
        this.clientPhone = clientPhone;
    }

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getClientId() {
		return clientId;
	}

	public void setClientId(Integer clientId) {
		this.clientId = clientId;
	}

	public Integer getServiceId() {
		return serviceId;
	}

	public void setServiceId(Integer serviceId) {
		this.serviceId = serviceId;
	}

	public LocalDate getBookingDate() {
		return bookingDate;
	}

	public void setBookingDate(LocalDate bookingDate) {
		this.bookingDate = bookingDate;
	}

	public LocalTime getBookingTime() {
		return bookingTime;
	}

	public void setBookingTime(LocalTime bookingTime) {
		this.bookingTime = bookingTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public String getClientEmail() {
		return clientEmail;
	}

	public void setClientEmail(String clientEmail) {
		this.clientEmail = clientEmail;
	}

	public String getClientPhone() {
		return clientPhone;
	}

	public void setClientPhone(String clientPhone) {
		this.clientPhone = clientPhone;
	}
}
