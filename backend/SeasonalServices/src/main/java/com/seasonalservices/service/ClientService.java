package com.seasonalservices.service;

import java.util.List;
import java.util.Optional;

import com.seasonalservices.entities.Client;

public interface ClientService {
	List<Client> getAllClients();

	Client addClient(Client client);

	int updateClient(Client client);

	int deleteClient(int id);

	Optional<Client> getClientById(int id); 
}
