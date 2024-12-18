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

    // RowMapper for Booking
    private RowMapper<Booking> bookingRowMapper = (rs, rowNum) -> {
        Booking booking = new Booking();
        booking.setId(rs.getInt("id"));
        booking.setServiceId(rs.getInt("service_id"));
        booking.setBookingDate(rs.getDate("booking_date").toLocalDate());
        booking.setBookingTime(rs.getTime("booking_time").toLocalTime());
        booking.setStatus(rs.getString("status"));
        booking.setComments(rs.getString("comments"));

        booking.setClientName(rs.getString("client_name"));
        booking.setClientEmail(rs.getString("client_email"));
        booking.setClientPhone(rs.getString("client_phone"));
        booking.setServiceName(rs.getString("service_name"));

        return booking;
    };

    // Retrieve all bookings
    public List<Booking> findAll() {
        String sql = "SELECT b.*, s.service_name " +
                     "FROM bookings b " +
                     "JOIN services s ON b.service_id = s.id";
        return jdbcTemplate.query(sql, bookingRowMapper);
    }

    // Find a booking by ID
    public Booking findById(int id) {
        String sql = "SELECT b.*, s.service_name " +
                     "FROM bookings b " +
                     "JOIN services s ON b.service_id = s.id " +
                     "WHERE b.id = ?";
        List<Booking> bookings = jdbcTemplate.query(sql, bookingRowMapper, id);
        return bookings.isEmpty() ? null : bookings.get(0);
    }

    // Save a new booking
    public int save(Booking booking) {
        String sql = "INSERT INTO bookings (service_id, booking_date, booking_time, status, comments, client_name, client_email, client_phone) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                booking.getServiceId(),
                Date.valueOf(booking.getBookingDate()),
                Time.valueOf(booking.getBookingTime()),
                booking.getStatus(),
                booking.getComments(),
                booking.getClientName(),
                booking.getClientEmail(),
                booking.getClientPhone()
        );
    }

    // Update an existing booking
    public int update(Booking booking) {
        String sql = "UPDATE bookings SET service_id = ?, booking_date = ?, booking_time = ?, " +
                     "status = ?, comments = ?, client_name = ?, client_email = ?, client_phone = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                booking.getServiceId(),
                Date.valueOf(booking.getBookingDate()),
                Time.valueOf(booking.getBookingTime()),
                booking.getStatus(),
                booking.getComments(),
                booking.getClientName(),
                booking.getClientEmail(),
                booking.getClientPhone(),
                booking.getId()
        );
    }

    // Delete a booking
    public int delete(int id) {
        String sql = "DELETE FROM bookings WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
