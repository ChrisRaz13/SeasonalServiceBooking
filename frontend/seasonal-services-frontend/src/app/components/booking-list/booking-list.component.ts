import { Component, OnInit } from '@angular/core';
import { BookingService, Booking } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = []; // Booking list

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings(): void {
    this.bookingService.getAllBookings().subscribe(
      (data: Booking[]) => {
        this.bookings = data;
      },
      (error) => {
        console.error('Error fetching bookings', error);
      }
    );
  }
}