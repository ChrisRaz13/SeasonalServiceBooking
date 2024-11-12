import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { ServiceService } from '../../services/service.service';
import { Booking } from '../../models/booking.model';
import { ServiceEntity } from '../../models/service.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  services: ServiceEntity[] = [];
  isSubmitting = false;
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

  availableTimes = [
    { value: '08:00', display: '8:00 AM' },
    { value: '09:00', display: '9:00 AM' },
    { value: '10:00', display: '10:00 AM' },
    { value: '11:00', display: '11:00 AM' },
    { value: '12:00', display: '12:00 PM' },
    { value: '13:00', display: '1:00 PM' },
    { value: '14:00', display: '2:00 PM' },
    { value: '15:00', display: '3:00 PM' },
    { value: '16:00', display: '4:00 PM' }
  ];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private serviceService: ServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      serviceId: ['', Validators.required],
      bookingDate: ['', Validators.required],
      bookingTime: ['', Validators.required],
      comments: [''],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        this.snackBar.open('Error loading services. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading services:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const booking: Booking = {
        clientId: 0, // Set appropriately if you have a client system
        serviceId: this.bookingForm.value.serviceId,
        bookingDate: this.bookingForm.value.bookingDate.toISOString().split('T')[0],
        bookingTime: this.bookingForm.value.bookingTime,
        comments: this.bookingForm.value.comments,
        status: 'pending',
        clientName: this.bookingForm.value.clientName,
        clientEmail: this.bookingForm.value.clientEmail,
        clientPhone: this.bookingForm.value.clientPhone
      };

      this.bookingService.addBooking(booking).subscribe({
        next: () => {
          this.snackBar.open('Booking successful! We will contact you shortly.', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('An error occurred while booking. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Booking error:', error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }
}
