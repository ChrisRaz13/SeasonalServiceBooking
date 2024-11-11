package com.seasonalservices.repository;

import com.seasonalservices.entities.Client;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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

    public Optional<Client> findById(int id) {
        String sql = "SELECT * FROM clients WHERE id = ?";
        List<Client> clients = jdbcTemplate.query(sql, clientRowMapper, id);
        return clients.isEmpty() ? Optional.empty() : Optional.of(clients.get(0));
    }

    public Client save(Client client) {
        String sql = "INSERT INTO clients (name, email, phone_number, address) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                client.getName(),
                client.getEmail(),
                client.getPhoneNumber(),
                client.getAddress()
        );

        // Retrieve the generated ID
        Integer generatedId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
        client.setId(generatedId);
        return client;
    }

    public int update(Client client) {
        String sql = "UPDATE clients SET name = ?, email = ?, phone_number = ?, address = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                client.getName(),
                client.getEmail(),
                client.getPhoneNumber(),
                client.getAddress(),
                client.getId()
        );
    }

    public int delete(int id) {
        String sql = "DELETE FROM clients WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
