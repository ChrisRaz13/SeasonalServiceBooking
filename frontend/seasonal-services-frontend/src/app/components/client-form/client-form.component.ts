import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Import ReactiveFormsModule here
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup; // Use the FormGroup type
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialize the form with default values and validation rules
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
    });

    // If clientId exists, load the client data
    if (this.clientId) {
      this.clientService.getClientById(this.clientId).subscribe((client: Client) => {
        this.clientForm.patchValue(client);
      });
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;

      if (this.clientId) {
        // Update client
        this.clientService.updateClient(this.clientId, clientData).subscribe(() => {
          this.router.navigate(['/clients']);
        });
      } else {
        // Add new client
        this.clientService.addClient(clientData).subscribe(() => {
          this.router.navigate(['/clients']);
        });
      }
    }
  }
}
