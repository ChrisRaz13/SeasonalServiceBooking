package com.seasonalservices.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.seasonalservices.entities.Client;
import com.seasonalservices.service.ClientService;

@Service
public class ClientServiceImpl implements ClientService {
    
    private final JdbcTemplate jdbcTemplate;
    
    @Autowired
    public ClientServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    @Override
    public List<Client> getAllClients() {
        String sql = "SELECT * FROM clients";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Client.class));
    }

    @Override
    public int addClient(Client client) {
        String sql = "INSERT INTO clients (name, email, phone_number, address) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, client.getName(), client.getEmail(), client.getPhoneNumber(), client.getAddress());
    }

    @Override
    public int updateClient(Client client) {
        String sql = "UPDATE clients SET name = ?, email = ?, phone_number = ?, address = ? WHERE id = ?";
        return jdbcTemplate.update(sql, client.getName(), client.getEmail(), client.getPhoneNumber(), client.getAddress(), client.getId());
    }

    @Override
    public int deleteClient(int id) {
        String sql = "DELETE FROM clients WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
