import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

interface BusinessHour {
  day: string;
  hours: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  emailSubscription: string = '';
  isNewsletterSubmitted: boolean = false;
  currentTime: Date = new Date();
  showChatWidget: boolean = false;

  businessHours: BusinessHour[] = [
    { day: 'Monday', hours: '7:00 AM - 8:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '7:00 AM - 8:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '7:00 AM - 8:00 PM', isOpen: true },
    { day: 'Thursday', hours: '7:00 AM - 8:00 PM', isOpen: true },
    { day: 'Friday', hours: '7:00 AM - 6:00 PM', isOpen: true },
    { day: 'Saturday', hours: '8:00 AM - 4:00 PM', isOpen: true },
    { day: 'Sunday', hours: 'Emergency Only', isOpen: false }
  ];

  quickLinks = [
    { label: 'Schedule Service', route: '/schedule' },
    { label: 'Get Quote', route: '/quote' },
    { label: 'Snow Plowing', route: '/snowplowing-service-page' },
    { label: 'Lawn Care', route: '/lawn-care' }
  ];

  socialLinks = [
    { icon: 'facebook', url: '#', label: 'Facebook' },
    { icon: 'twitter', url: '#', label: 'Twitter' },
    { icon: 'instagram', url: '#', label: 'Instagram' },
    { icon: 'linkedin', url: '#', label: 'LinkedIn' }
  ];

  constructor() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnInit(): void {
    this.checkBusinessHours();
  }

  getCurrentStatus(): string {
    const now = new Date();
    const day = now.getDay();
    const currentHour = now.getHours();

    const todayHours = this.businessHours[day === 0 ? 6 : day - 1];
    if (!todayHours.isOpen) return 'Closed';

    const [openTime, closeTime] = this.parseHours(todayHours.hours);
    if (currentHour >= openTime && currentHour < closeTime) {
      return 'Open Now';
    }
    return 'Closed';
  }

  private parseHours(hours: string): number[] {
    if (hours === 'Emergency Only') return [0, 0];
    const [open, close] = hours.split(' - ');
    return [
      parseInt(open.split(':')[0]) + (open.includes('PM') ? 12 : 0),
      parseInt(close.split(':')[0]) + (close.includes('PM') ? 12 : 0)
    ];
  }

  subscribeToNewsletter(): void {
    if (this.emailSubscription) {
      // Implement newsletter subscription logic
      this.isNewsletterSubmitted = true;
      this.emailSubscription = '';
      setTimeout(() => this.isNewsletterSubmitted = false, 3000);
    }
  }

  toggleChatWidget(): void {
    this.showChatWidget = !this.showChatWidget;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private checkBusinessHours(): void {
    const currentDay = new Date().getDay();
    const currentHour = new Date().getHours();
    // Implement business hours check logic
  }
}
