package com.seasonalservices.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.seasonalservices.entities.ServiceEntity;

@Repository
public class ServiceRepository {

	private final JdbcTemplate jdbcTemplate;

	public ServiceRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	private RowMapper<ServiceEntity> serviceRowMapper = new RowMapper<ServiceEntity>() {
		@Override
		public ServiceEntity mapRow(ResultSet rs, int rowNum) throws SQLException {
			ServiceEntity service = new ServiceEntity();
			service.setId(rs.getInt("id"));
			service.setServiceName(rs.getString("service_name"));
			service.setDescription(rs.getString("description"));
			// Handle nullable base_price
			Double basePrice = rs.getObject("base_price") != null ? rs.getDouble("base_price") : null;
			service.setBasePrice(basePrice);
			return service;
		}
	};

	public List<ServiceEntity> findAll() {
		String sql = "SELECT * FROM services";
		return jdbcTemplate.query(sql, serviceRowMapper);
	}

	public ServiceEntity findById(int id) {
		String sql = "SELECT * FROM services WHERE id = ?";
		return jdbcTemplate.queryForObject(sql, new Object[] { id }, serviceRowMapper);
	}

	public int save(ServiceEntity service) {
		String sql = "INSERT INTO services (service_name, description, base_price) VALUES (?, ?, ?)";
		return jdbcTemplate.update(sql, service.getServiceName(), service.getDescription(), service.getBasePrice());
	}

	public int update(ServiceEntity service) {
		String sql = "UPDATE services SET service_name = ?, description = ?, base_price = ? WHERE id = ?";
		return jdbcTemplate.update(sql, service.getServiceName(), service.getDescription(), service.getBasePrice(),
				service.getId());
	}

	public int delete(int id) {
		String sql = "DELETE FROM services WHERE id = ?";
		return jdbcTemplate.update(sql, id);
	}
}
