package com.seasonalservices.entities;

public class Booking {
	private Integer id;
	private String serviceName; 
	private String bookingDate; 
	private String bookingTime; 
	private Integer clientId;

	public Booking() {
	}

	public Booking(Integer id, String serviceName, String bookingDate, String bookingTime, Integer clientId) {
		this.id = id;
		this.serviceName = serviceName;
		this.bookingDate = bookingDate;
		this.bookingTime = bookingTime;
		this.clientId = clientId;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getBookingDate() {
		return bookingDate;
	}

	public void setBookingDate(String bookingDate) {
		this.bookingDate = bookingDate;
	}

	public String getBookingTime() {
		return bookingTime;
	}

	public void setBookingTime(String bookingTime) {
		this.bookingTime = bookingTime;
	}

	public Integer getClientId() {
		return clientId;
	}

	public void setClientId(Integer clientId) {
		this.clientId = clientId;
	}
}
