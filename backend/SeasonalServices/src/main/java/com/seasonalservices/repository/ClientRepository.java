package com.seasonalservices.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.seasonalservices.entities.Client; // Correct import

@Repository
public class ClientRepository {

	private final JdbcTemplate jdbcTemplate;

	public ClientRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	private RowMapper<Client> clientRowMapper = (rs, rowNum) -> {
		Client client = new Client();
		client.setId(rs.getInt("id"));
		client.setName(rs.getString("name"));
		client.setEmail(rs.getString("email"));
		client.setPhoneNumber(rs.getString("phone_number"));
		client.setAddress(rs.getString("address"));
		return client;
	};

	public List<Client> findAll() {
		String sql = "SELECT * FROM clients";
		return jdbcTemplate.query(sql, clientRowMapper);
	}

	public Client findById(int id) {
		String sql = "SELECT * FROM clients WHERE id = ?";
		return jdbcTemplate.queryForObject(sql, new Object[] { id }, clientRowMapper);
	}

	public int save(Client client) {
		String sql = "INSERT INTO clients (name, email, phone_number, address) VALUES (?, ?, ?, ?)";
		return jdbcTemplate.update(sql, client.getName(), client.getEmail(), client.getPhoneNumber(),
				client.getAddress());
	}

	public int update(Client client) {
		String sql = "UPDATE clients SET name = ?, email = ?, phone_number = ?, address = ? WHERE id = ?";
		return jdbcTemplate.update(sql, client.getName(), client.getEmail(), client.getPhoneNumber(),
				client.getAddress(), client.getId());
	}

	public int delete(int id) {
		String sql = "DELETE FROM clients WHERE id = ?";
		return jdbcTemplate.update(sql, id);
	}
}
