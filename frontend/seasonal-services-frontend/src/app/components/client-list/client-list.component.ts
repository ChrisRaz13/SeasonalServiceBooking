import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule // Import HttpClientModule here
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.clientService.getAllClients().subscribe(
      (data: Client[]) => {
        this.clients = data;
        console.log('Clients loaded:', data); // Debugging log
      },
      (error) => {
        console.error('Error fetching clients', error);
      }
    );
  }

  editClient(id?: number): void {
    if (id !== undefined) {
      this.router.navigate(['/clients/edit', id]);
    }
  }

  deleteClient(id?: number): void {
    if (id !== undefined && confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.clients = this.clients.filter(client => client.id !== id);
      });
    }
  }}
