package com.seasonalservices.service;

import com.seasonalservices.entities.Booking;

import java.util.List;
import java.util.Optional;

public interface BookingService {
	List<Booking> getAllBookings();

	Optional<Booking> getBookingById(int id); 

	int addBooking(Booking booking);

	int updateBooking(Booking booking);

	int deleteBooking(int id);
}
