import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BookingService } from '../../services/booking.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  templateUrl: './booking-calendar.component.html',
  styleUrls: ['./booking-calendar.component.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    FullCalendarModule,
  ],
})
export class BookingCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    editable: true,
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings(); // Load booking data when component initializes
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe(
      (bookings: Booking[]) => {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: bookings.map((booking) => ({
            id: booking.id.toString(), // Convert id to string to meet FullCalendar's requirements
            title: booking.serviceName,
            start: `${booking.bookingDate}T${booking.bookingTime}`, // Combining date and time in ISO format
            extendedProps: {
              clientId: booking.clientId,
            },
          })),
        };
      },
      (error) => {
        console.error('Error loading bookings:', error);
      }
    );
  }



  handleDateClick(arg: any): void {
    const bookingDate = arg.dateStr; // Date clicked in YYYY-MM-DD format
    const newBooking: Booking = {
      id: 0, // Temporary, since the database will generate a new ID
      serviceName: 'Lawn Care', // You might want to make this selectable
      bookingDate: bookingDate,
      bookingTime: '09:00', // Default time, or you can make it input-based
      clientId: 1 // Set this dynamically, maybe by asking the user or pulling from logged-in client
    };

    // Here, you can open a dialog or make an API call to save the new booking
    this.bookingService.addBooking(newBooking).subscribe(
      (savedBooking: Booking) => {
        // Add the new booking to the calendar
        this.calendarOptions.events = [...(this.calendarOptions.events as any), {
          id: savedBooking.id.toString(),
          title: savedBooking.serviceName,
          start: `${savedBooking.bookingDate}T${savedBooking.bookingTime}`,
          extendedProps: {
            clientId: savedBooking.clientId,
          },
        }];
      },
      (error) => {
        console.error('Error creating booking:', error);
      }
    );
  }


  handleEventClick(arg: any): void {
    console.log('Event clicked:', arg.event.title);
    // Here you can add logic to edit/view details of the selected booking
  }
}
