package com.seasonalservices.service;

import java.util.List;

import com.seasonalservices.entities.Client;

public interface ClientService {
    List<Client> getAllClients();

	int addClient(Client client);

	int updateClient(Client client);

	int deleteClient(int id);
}
  