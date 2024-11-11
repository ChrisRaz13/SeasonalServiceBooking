import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { ServiceService } from '../../services/service.service';
import { Booking } from '../../models/booking.model';
import { ServiceEntity } from '../../models/service.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  services: ServiceEntity[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private serviceService: ServiceService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      serviceId: ['', Validators.required],
      bookingDate: ['', Validators.required],
      bookingTime: ['', Validators.required],
      comments: [''],
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe((services) => {
      this.services = services;
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const booking: Booking = {
        clientId: 0, // Set the clientId appropriately
        serviceId: this.bookingForm.value.serviceId,
        bookingDate: this.bookingForm.value.bookingDate,
        bookingTime: this.bookingForm.value.bookingTime,
        comments: this.bookingForm.value.comments,
        status: 'pending',
      };

      this.bookingService.addBooking(booking).subscribe(
        () => {
          alert('Booking successful!');
          this.router.navigate(['/']); // Redirect as needed
        },
        (error) => {
          console.error(error);
          alert('An error occurred while booking.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
