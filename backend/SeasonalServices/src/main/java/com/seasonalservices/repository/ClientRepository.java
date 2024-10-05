package com.seasonalservices.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.seasonalservices.entities.Client;

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
        List<Client> clients = jdbcTemplate.query(sql, new Object[]{id}, clientRowMapper);
        return clients.isEmpty() ? Optional.empty() : Optional.of(clients.get(0));
    }

    public Client save(Client client) {
        String sql = "INSERT INTO clients (name, email, phone_number, address) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, client.getName());
            ps.setString(2, client.getEmail());
            ps.setString(3, client.getPhoneNumber());
            ps.setString(4, client.getAddress());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            client.setId(keyHolder.getKey().intValue());
        }

        return client;
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