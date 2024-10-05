package com.seasonalservices.service.impl;

import com.seasonalservices.entities.Booking;
import com.seasonalservices.repository.BookingRepository;
import com.seasonalservices.service.BookingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    public BookingServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(int id) {
        return bookingRepository.findById(id);
    }

    @Override
    public int addBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public int updateBooking(Booking booking) {
        return bookingRepository.update(booking);
    }

    @Override
    public int deleteBooking(int id) {
        return bookingRepository.delete(id);
    }
}
