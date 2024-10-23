import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { FooterComponent } from "../../layout/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FooterComponent]
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
