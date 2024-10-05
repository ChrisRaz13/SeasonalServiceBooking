package com.seasonalservices;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.seasonalservices.entities.Client;
import com.seasonalservices.repository.ClientRepository;
import com.seasonalservices.service.impl.ClientServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientServiceImpl clientService; 

    @Test
    public void testAddClient() {
        Client client = new Client();
        client.setName("John Doe");
        client.setEmail("john.doe@example.com");
        client.setPhoneNumber("123-456-7890");
        client.setAddress("123 Main St");

        Client savedClient = new Client();
        savedClient.setId(1);
        savedClient.setName("John Doe");
        savedClient.setEmail("john.doe@example.com");
        savedClient.setPhoneNumber("123-456-7890");
        savedClient.setAddress("123 Main St");

        when(clientRepository.save(any(Client.class))).thenReturn(savedClient);

        Client result = clientService.addClient(client);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("John Doe", result.getName());
        assertEquals("john.doe@example.com", result.getEmail());
        assertEquals("123-456-7890", result.getPhoneNumber());
        assertEquals("123 Main St", result.getAddress());

        verify(clientRepository, times(1)).save(any(Client.class));
    }

    @Test
    public void testGetClientById() {
        Client client = new Client();
        client.setId(1);
        client.setName("Jane Doe");
        client.setEmail("jane.doe@example.com");
        client.setPhoneNumber("098-765-4321");
        client.setAddress("456 Elm St");

        when(clientRepository.findById(1)).thenReturn(client);

        Client foundClient = clientService.getClientById(1);

        assertNotNull(foundClient);
        assertEquals(1, foundClient.getId());
        assertEquals("Jane Doe", foundClient.getName());
        assertEquals("jane.doe@example.com", foundClient.getEmail());
        assertEquals("098-765-4321", foundClient.getPhoneNumber());
        assertEquals("456 Elm St", foundClient.getAddress());

        verify(clientRepository, times(1)).findById(1);
    }

    @Test
    public void testUpdateClient() {
        Client client = new Client();
        client.setId(1);
        client.setName("Jane Smith");
        client.setEmail("jane.smith@example.com");
        client.setPhoneNumber("111-222-3333");
        client.setAddress("789 Oak St");

        when(clientRepository.update(any(Client.class))).thenReturn(client);

        Client updatedClient = clientService.updateClient(client);

        assertNotNull(updatedClient);
        assertEquals(1, updatedClient.getId());
        assertEquals("Jane Smith", updatedClient.getName());
        assertEquals("jane.smith@example.com", updatedClient.getEmail());
        assertEquals("111-222-3333", updatedClient.getPhoneNumber());
        assertEquals("789 Oak St", updatedClient.getAddress());

        verify(clientRepository, times(1)).update(any(Client.class));
    }

    @Test
    public void testDeleteClient() {
        int clientId = 1;
        when(clientRepository.delete(clientId)).thenReturn(true);

        boolean isDeleted = clientService.deleteClient(clientId);

        assertEquals(true, isDeleted);

        verify(clientRepository, times(1)).delete(clientId);
    }
}
