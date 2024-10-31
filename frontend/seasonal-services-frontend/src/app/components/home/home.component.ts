import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../layout/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FooterComponent, RouterModule]
})
export class HomeComponent implements OnInit {
  services = [
    {
      name: 'Residential Snow Plowing',
      description: 'Quick snow removal for driveways and walkways.',
      link: '/residential-snow',
    },
    {
      name: 'Commercial Snow Management',
      description: '24/7 snow removal and ice management.',
      link: '/commercial-snow',
    },
    {
      name: 'Spring Lawn Care',
      description: 'Soil aeration and new growth treatments.',
      link: '/spring-lawn',
    },
    {
      name: 'Fall Cleanups',
      description: 'Debris and leaf removal for a clean yard.',
      link: '/fall-cleanup',
    },
  ];

  testimonials = [
    {
      quote: 'Fantastic snow removal! Highly recommend.',
      author: 'John D.',
    },
    {
      quote: 'Lawn care team is reliable and efficient.',
      author: 'Sarah W.',
    },
    {
      quote: 'Best service in town!',
      author: 'Chris B.',
    },
  ];

  currentIndex = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Start auto-rotation for testimonials every 5 seconds
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }, 5000); // Rotate every 5 seconds
  }

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
