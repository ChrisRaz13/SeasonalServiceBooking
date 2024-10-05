package com.seasonalservices.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.seasonalservices.entities.Client;
import com.seasonalservices.repository.ClientRepository;
import com.seasonalservices.service.ClientService;

@Service
public class ClientServiceImpl implements ClientService {

	private final ClientRepository clientRepository;
	private final JdbcTemplate jdbcTemplate; // Declare JdbcTemplate here

	@Autowired
	public ClientServiceImpl(ClientRepository clientRepository, JdbcTemplate jdbcTemplate) {
		this.clientRepository = clientRepository;
		this.jdbcTemplate = jdbcTemplate; // Initialize JdbcTemplate
	}

	@Override
	public List<Client> getAllClients() {
		return clientRepository.findAll();
	}

	@Override
	public Client addClient(Client client) {
		return clientRepository.save(client);
	}

	@Override
	public int updateClient(Client client) {
		String sql = "UPDATE clients SET name = ?, email = ?, phone_number = ?, address = ? WHERE id = ?";
		return jdbcTemplate.update(sql, client.getName(), client.getEmail(), client.getPhoneNumber(),
				client.getAddress(), client.getId());
	}

	@Override
	public int deleteClient(int id) {
		String sql = "DELETE FROM clients WHERE id = ?";
		return jdbcTemplate.update(sql, id);
	}

	@Override
	public Optional<Client> getClientById(int id) {
	    return clientRepository.findById(id);
	}

	}

