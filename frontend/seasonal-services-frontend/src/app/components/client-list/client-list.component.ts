import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule], // Allows use of common Angular directives like *ngFor
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.clientService.getAllClients().subscribe(
      (data: Client[]) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error fetching clients', error);
      }
    );
  }
}
