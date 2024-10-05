package com.seasonalservices.repository;

import com.seasonalservices.entities.ServiceEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ServiceRepository {

    private final JdbcTemplate jdbcTemplate;

    public ServiceRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<ServiceEntity> serviceRowMapper = (rs, rowNum) -> {
        ServiceEntity service = new ServiceEntity();
        service.setId(rs.getInt("id"));
        service.setServiceName(rs.getString("service_name"));
        service.setDescription(rs.getString("description"));
        service.setBasePrice(rs.getDouble("base_price"));
        return service;
    };


    public List<ServiceEntity> findAll() {
        String sql = "SELECT * FROM services";
        return jdbcTemplate.query(sql, serviceRowMapper);
    }

    public ServiceEntity findById(int id) {
        String sql = "SELECT * FROM services WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, serviceRowMapper);
    }

    public int save(ServiceEntity service) {
        String sql = "INSERT INTO services (service_name, description, base_price) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, service.getServiceName(), service.getDescription(), service.getBasePrice());
    }

    public int update(ServiceEntity service) {
        String sql = "UPDATE services SET service_name = ?, description = ?, base_price = ? WHERE id = ?";
        return jdbcTemplate.update(sql, service.getServiceName(), service.getDescription(), service.getBasePrice(), service.getId());
    }

    public int delete(int id) {
        String sql = "DELETE FROM services WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
