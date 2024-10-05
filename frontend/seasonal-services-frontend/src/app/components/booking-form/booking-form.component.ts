import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService} from '../../services/booking.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule for reactive forms
import { Router } from '@angular/router';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Add ReactiveFormsModule here
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup; // Form to capture booking details
  clients: Client[] = []; // Clients available for selection

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      clientId: ['', Validators.required],
      serviceName: ['Snow Plowing', Validators.required],
      bookingDate: ['', Validators.required],
      bookingTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe((data: Client[]) => {
      this.clients = data;
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const booking: Booking = this.bookingForm.value;
      this.bookingService.addBooking(booking).subscribe(() => {
        this.router.navigate(['/booking-list']);
      });
    }
  }
}
