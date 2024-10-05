package com.seasonalservices.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@CrossOrigin(origins = "http://localhost:4200")
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
		Optional<Client> client = clientService.getClientById(id);
		if (client.isPresent()) {
			return new ResponseEntity<>(client.get(), HttpStatus.OK);
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
	public ResponseEntity<Client> updateClient(@PathVariable int id, @RequestBody Client client) {
		client.setId(id);
		int result = clientService.updateClient(client);
		if (result > 0) {
			return ResponseEntity.ok(client);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteClient(@PathVariable int id) {
		int result = clientService.deleteClient(id);
		if (result > 0) {
			return ResponseEntity.noContent().build();
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
