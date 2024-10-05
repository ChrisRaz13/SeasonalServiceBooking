package com.seasonalservices.repository;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.seasonalservices.entities.Booking;

@Repository
public class BookingRepository {

	private final JdbcTemplate jdbcTemplate;

	public BookingRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	// RowMapper for Booking to map rows from the database
	private RowMapper<Booking> bookingRowMapper = (rs, rowNum) -> {
		Booking booking = new Booking();
		booking.setId(rs.getInt("id"));
		booking.setServiceName(rs.getString("service_name"));
		booking.setBookingDate(rs.getDate("booking_date").toString());
		booking.setBookingTime(rs.getTime("booking_time").toString());
		booking.setClientId(rs.getInt("client_id"));
		return booking;
	};

	// Retrieve all bookings from the database
	public List<Booking> findAll() {
		String sql = "SELECT * FROM bookings";
		return jdbcTemplate.query(sql, bookingRowMapper);
	}

	// Find a booking by its ID
	public Booking findById(int id) {
		String sql = "SELECT * FROM bookings WHERE id = ?";
		List<Booking> bookings = jdbcTemplate.query(sql, new Object[] { id }, bookingRowMapper);
		return bookings.isEmpty() ? null : bookings.get(0);
	}

	// Save a new booking to the database
	public int save(Booking booking) {
		String sql = "INSERT INTO bookings (service_name, booking_date, booking_time, client_id) VALUES (?, ?, ?, ?)";
		return jdbcTemplate.update(sql, booking.getServiceName(), Date.valueOf(booking.getBookingDate()),
				Time.valueOf(booking.getBookingTime()), booking.getClientId());
	}

	// Update an existing booking in the database
	public int update(Booking booking) {
		String sql = "UPDATE bookings SET service_name = ?, booking_date = ?, booking_time = ?, client_id = ? WHERE id = ?";
		return jdbcTemplate.update(sql, booking.getServiceName(), Date.valueOf(booking.getBookingDate()),
				Time.valueOf(booking.getBookingTime()), booking.getClientId(), booking.getId());
	}

	// Delete a booking from the database by its ID
	public int delete(int id) {
		String sql = "DELETE FROM bookings WHERE id = ?";
		return jdbcTemplate.update(sql, id);
	}
}
