package com.seasonalservices.service.impl;

import com.seasonalservices.entities.Client;
import com.seasonalservices.repository.ClientRepository;
import com.seasonalservices.service.ClientService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

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
    public int updateClient(Client client) {
        return clientRepository.update(client);
    }

    @Override
    public int deleteClient(int id) {
        return clientRepository.delete(id);
    }

    @Override
    public Optional<Client> getClientById(int id) {
        return clientRepository.findById(id);
    }
}
