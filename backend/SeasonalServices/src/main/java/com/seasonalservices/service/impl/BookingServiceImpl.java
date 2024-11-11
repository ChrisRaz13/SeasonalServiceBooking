package com.seasonalservices.service.impl;

import com.seasonalservices.entities.Booking;
import com.seasonalservices.repository.BookingRepository;
import com.seasonalservices.service.BookingService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public Optional<Booking> getBookingById(int id) {
        return Optional.ofNullable(bookingRepository.findById(id));
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
