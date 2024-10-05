package com.seasonalservices.repository;

import java.sql.Timestamp;
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

    private RowMapper<Booking> bookingRowMapper = (rs, rowNum) -> {
        Booking booking = new Booking();
        booking.setId(rs.getInt("id"));
        booking.setClientId(rs.getInt("client_id"));
        booking.setServiceId(rs.getInt("service_id"));
        booking.setBookingDateTime(rs.getTimestamp("booking_datetime").toLocalDateTime());
        booking.setStatus(rs.getString("status"));
        return booking;
    };


    public List<Booking> findAll() {
        String sql = "SELECT * FROM bookings";
        return jdbcTemplate.query(sql, bookingRowMapper);
    }

    public Booking findById(int id) {
        String sql = "SELECT * FROM bookings WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, bookingRowMapper);
    }

    public int save(Booking booking) {
        String sql = "INSERT INTO bookings (client_id, service_id, booking_datetime, status) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, booking.getClientId(), booking.getServiceId(),
                Timestamp.valueOf(booking.getBookingDateTime()), booking.getStatus());
    }

    public int update(Booking booking) {
        String sql = "UPDATE bookings SET client_id = ?, service_id = ?, booking_datetime = ?, status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, booking.getClientId(), booking.getServiceId(),
                Timestamp.valueOf(booking.getBookingDateTime()), booking.getStatus(), booking.getId());
    }


    public int delete(int id) {
        String sql = "DELETE FROM bookings WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
    
    
}
