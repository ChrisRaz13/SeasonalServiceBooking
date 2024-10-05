import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FullCalendarModule]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToClients(): void {
    this.router.navigate(['/clients']);
  }

  navigateToBookings(): void {
    this.router.navigate(['/bookings']);
  }

  navigateToSnowPlowingCalendar(): void {
    this.router.navigate(['/snow-plowing-calendar']);
  }
}
