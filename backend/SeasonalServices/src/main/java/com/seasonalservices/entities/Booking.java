package com.seasonalservices.entities;

import java.time.LocalDate;
import java.time.LocalTime;

public class Booking {
    private Integer id;
    private String serviceName;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String name;
    private String email;
    private String phone;

    public Booking() {
    }

    public Booking(Integer id, String serviceName, LocalDate bookingDate, LocalTime bookingTime, String name, String email, String phone) {
        this.id = id;
        this.serviceName = serviceName;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.name = name;
        this.email = email;
        this.phone = phone;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
    
}
