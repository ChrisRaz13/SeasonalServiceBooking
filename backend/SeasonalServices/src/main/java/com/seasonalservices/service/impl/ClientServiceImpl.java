package com.seasonalservices.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seasonalservices.entities.Client;
import com.seasonalservices.repository.ClientRepository;
import com.seasonalservices.service.ClientService;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
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
    public Client updateClient(Client client) {
        return clientRepository.update(client);
    }

    @Override
    public boolean deleteClient(int id) {
        return clientRepository.delete(id);
    }

    @Override
    public Client getClientById(int id) {
        return clientRepository.findById(id);
    }
}
