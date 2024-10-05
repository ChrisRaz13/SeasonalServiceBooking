package com.seasonalservices.controller;

import java.util.List;
import java.util.Optional; // Ensure this is properly imported
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seasonalservices.entities.Booking;
import com.seasonalservices.service.BookingService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	@GetMapping
	public ResponseEntity<List<Booking>> getAllBookings() {
		List<Booking> bookings = bookingService.getAllBookings();
		return new ResponseEntity<>(bookings, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Optional<Booking>> getBookingById(@PathVariable int id) {
		Optional<Booking> booking = bookingService.getBookingById(id);
		return ResponseEntity.ok(booking);
	}

	@GetMapping("/snowplowing")
	public ResponseEntity<List<Booking>> getSnowPlowingBookings() {
		List<Booking> bookings = bookingService.getAllBookings().stream()
				.filter(booking -> "Snow Plowing".equals(booking.getServiceName())).collect(Collectors.toList());
		return new ResponseEntity<>(bookings, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Void> addBooking(@RequestBody Booking booking) {
		bookingService.addBooking(booking);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<Void> updateBooking(@PathVariable int id, @RequestBody Booking booking) {
		booking.setId(id);
		bookingService.updateBooking(booking);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBooking(@PathVariable int id) {
		bookingService.deleteBooking(id);
		return ResponseEntity.noContent().build();
	}
}
