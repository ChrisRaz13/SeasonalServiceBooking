package com.seasonalservices.entities;

import java.time.LocalDate;
import java.time.LocalTime;

public class Booking {
    private Integer id;
    private Integer serviceId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String status;
    private String comments;

    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String serviceName;


    public Booking() {
    }

    public Booking(Integer id, Integer serviceId, LocalDate bookingDate, LocalTime bookingTime,
                   String status, String comments, String clientName, String clientEmail,
                   String clientPhone, String serviceName) {
        this.id = id;
        this.serviceId = serviceId;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.status = status;
        this.comments = comments;
        this.clientName = clientName;
        this.clientEmail = clientEmail;
        this.clientPhone = clientPhone;
        this.serviceName = serviceName;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
}
