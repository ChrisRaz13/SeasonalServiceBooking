package com.seasonalservices.service;

import java.util.List;
import com.seasonalservices.entities.Client;

public interface ClientService {
    List<Client> getAllClients();

    Client addClient(Client client);

    Client updateClient(Client client);

    boolean deleteClient(int id);

    Client getClientById(int id);
}
