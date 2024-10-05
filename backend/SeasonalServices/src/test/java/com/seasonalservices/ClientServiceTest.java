package com.seasonalservices;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

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
        // Arrange
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

        // Act
        Client result = clientService.addClient(client);

        // Assert
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
        // Arrange
        Client client = new Client();
        client.setId(1);
        client.setName("Jane Doe");
        client.setEmail("jane.doe@example.com");
        client.setPhoneNumber("098-765-4321");
        client.setAddress("456 Elm St");

        // Correctly mock repository to return Optional<Client>
        when(clientRepository.findById(1)).thenReturn(Optional.of(client));

        // Act
        Client foundClient = clientService.getClientById(1).orElse(null);

        // Assert
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
        // Arrange
        Client client = new Client();
        client.setId(1);
        client.setName("Jane Smith");
        client.setEmail("jane.smith@example.com");
        client.setPhoneNumber("111-222-3333");
        client.setAddress("789 Oak St");

        when(clientRepository.update(any(Client.class))).thenReturn(1);  // Assuming update returns an int for success (usually number of rows updated)

        // Act
        int updateResult = clientService.updateClient(client);

        // Assert
        assertEquals(1, updateResult);
        verify(clientRepository, times(1)).update(any(Client.class));
    }

    @Test
    public void testDeleteClient() {
        // Arrange
        int clientId = 1;
        when(clientRepository.delete(clientId)).thenReturn(1);  // Assuming delete returns an int indicating success

        // Act
        int deleteResult = clientService.deleteClient(clientId);

        // Assert
        assertEquals(1, deleteResult);
        verify(clientRepository, times(1)).delete(clientId);
    }
}
