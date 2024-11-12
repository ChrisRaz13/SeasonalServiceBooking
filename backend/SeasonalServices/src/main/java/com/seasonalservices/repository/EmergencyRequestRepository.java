package com.seasonalservices.repository;

import com.seasonalservices.entities.EmergencyRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EmergencyRequestRepository {

    private final JdbcTemplate jdbcTemplate;

    public EmergencyRequestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // RowMapper
    private RowMapper<EmergencyRequest> rowMapper = (rs, rowNum) -> {
        EmergencyRequest request = new EmergencyRequest();
        request.setId(rs.getInt("id"));
        request.setName(rs.getString("name"));
        request.setPhone(rs.getString("phone"));
        request.setAddress(rs.getString("address"));
        request.setServiceType(rs.getString("service_type"));
        request.setDescription(rs.getString("description"));
        request.setRequestTime(rs.getTimestamp("request_time").toLocalDateTime());
        return request;
    };

    // Save a new emergency request
    public int save(EmergencyRequest request) {
        String sql = "INSERT INTO emergency_requests (name, phone, address, service_type, description) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                request.getName(),
                request.getPhone(),
                request.getAddress(),
                request.getServiceType(),
                request.getDescription());
    }

    // Retrieve all emergency requests
    public List<EmergencyRequest> findAll() {
        String sql = "SELECT * FROM emergency_requests";
        return jdbcTemplate.query(sql, rowMapper);
    }

}
