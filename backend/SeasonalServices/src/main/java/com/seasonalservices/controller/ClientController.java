package com.seasonalservices.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seasonalservices.entities.Client;
import com.seasonalservices.service.ClientService;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

	private final ClientService clientService;

	@Autowired
	public ClientController(ClientService clientService) {
		this.clientService = clientService;
	}

	@GetMapping
	public ResponseEntity<List<Client>> getAllClients() {
		List<Client> clients = clientService.getAllClients();
		return new ResponseEntity<>(clients, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Client> getClientById(@PathVariable int id) {
		Client client = clientService.getClientById(id);
		if (client != null) {
			return new ResponseEntity<>(client, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping
	public ResponseEntity<Client> addClient(@RequestBody @Validated Client client) {
		Client savedClient = clientService.addClient(client);
		return new ResponseEntity<>(savedClient, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Client> updateClient(@PathVariable int id, @RequestBody @Validated Client client) {
		client.setId(id);
		Client updatedClient = clientService.updateClient(client);
		if (updatedClient != null) {
			return new ResponseEntity<>(updatedClient, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteClient(@PathVariable int id) {
		boolean isDeleted = clientService.deleteClient(id);
		if (isDeleted) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
