import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToClients(): void {
    this.router.navigate(['/clients']);
  }

  navigateToBookings(): void {
    this.router.navigate(['/bookings']);
  }
}
