import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { animate, style, transition, trigger } from '@angular/animations';
import { WeatherService } from '../../services/weather.service';

interface ServiceCard {
  title: string;
  description: string;
  image: string;
  link: string;
  features: string[];
  icon: string;
}

interface WeatherAlertSeverity {
  label: string;
  color: string;
  icon: string;
  bgColor: string;
  pulseColor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(20px) scale(0.95)'
        }),
        animate('200ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0) scale(1)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({
          opacity: 0,
          transform: 'translateY(20px) scale(0.95)'
        }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  weatherAlerts: any[] = [];
  isLoading = true;
  hasError = false;
  showAlerts = false;

  private readonly severityConfig: { [key: string]: WeatherAlertSeverity } = {
    extreme: {
      label: 'Extreme',
      color: '#ff1744',
      icon: 'warning',
      bgColor: 'rgba(255, 23, 68, 0.95)',
      pulseColor: 'rgba(255, 23, 68, 0.6)'
    },
    severe: {
      label: 'Severe',
      color: '#f50057',
      icon: 'error',
      bgColor: 'rgba(245, 0, 87, 0.95)',
      pulseColor: 'rgba(245, 0, 87, 0.6)'
    },
    moderate: {
      label: 'Moderate',
      color: '#ff9100',
      icon: 'info',
      bgColor: 'rgba(255, 145, 0, 0.95)',
      pulseColor: 'rgba(255, 145, 0, 0.6)'
    },
    minor: {
      label: 'Minor',
      color: '#00b0ff',
      icon: 'info_outline',
      bgColor: 'rgba(0, 176, 255, 0.95)',
      pulseColor: 'rgba(0, 176, 255, 0.6)'
    }
  };

  services: ServiceCard[] = [
    {
      title: 'Snow Plowing',
      description: '24/7 Professional Snow Removal Services',
      image: 'https://media.istockphoto.com/id/536778097/photo/highway-snow-plow.jpg?s=2048x2048&w=is&k=20&c=ns8LS-y1-jWpJks808sCFeeSP14oyrS-l3Su6FA2_U4=',
      link: '/snow-plowing',
      features: ['24/7 Emergency Service', 'Commercial & Residential', 'De-icing Available'],
      icon: 'ac_unit'
    },
    {
      title: 'Lawn Care',
      description: 'Complete Lawn Maintenance Services',
      image: 'https://media.istockphoto.com/id/2044312647/photo/professional-latino-man-using-a-riding-lawnmower-caring-for-a-park-with-a-landscaping-company.jpg?s=2048x2048&w=is&k=20&c=Ael-VrEpwZbobzfnGj8V7HBShBPVB81I7reWtxVcZ6o=',
      link: '/lawn-care',
      features: ['Weekly Mowing', 'Fertilization', 'Weed Control'],
      icon: 'grass'
    }
  ];

  testimonials = [
    {
      quote: "Alex Services has been maintaining our property for years. Their reliability and professionalism are unmatched!",
      author: "Sarah Johnson",
      role: "Homeowner",
      rating: 5
    },
    {
      quote: "The best snow removal service in Iowa City. They're always here when we need them most.",
      author: "Mike Thompson",
      role: "Business Owner",
      rating: 5
    }
  ];

  currentTestimonialIndex = 0;

  constructor(private weatherService: WeatherService, private router: Router) {}

  ngOnInit(): void {
    this.loadWeatherAlerts();
    this.rotateTestimonials();
    // Refresh weather alerts every 5 minutes
    setInterval(() => this.loadWeatherAlerts(), 300000);
  }

  loadWeatherAlerts(): void {
    const lat = 61.1043; // Iowa City coordinates
    const lon = -149.8173;

    this.weatherService.getWeatherAlerts(lat, lon).subscribe({
      next: (data) => {
        if (data.features && data.features.length > 0) {
          this.weatherAlerts = data.features.map((feature: any) => ({
            event: feature.properties.event,
            headline: feature.properties.headline,
            description: feature.properties.description,
            severity: feature.properties.severity,
            expires: feature.properties.expires,
            effective: feature.properties.effective,
            senderName: feature.properties.senderName,
            areaDesc: feature.properties.areaDesc,
            instruction: feature.properties.instruction,
            parameters: feature.properties.parameters
          }));
          // Sort alerts by severity
          this.weatherAlerts.sort((a, b) =>
            this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity)
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading weather alerts:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  private getSeverityWeight(severity: string): number {
    const weights: Record<string, number> = {
      'extreme': 4,
      'severe': 3,
      'moderate': 2,
      'minor': 1
    };
    return weights[severity.toLowerCase()] || 0;
  }

  getAlertSeverityClass(severity: string): string {
    const severityLower = severity?.toLowerCase() || 'minor';
    return `severity-${severityLower}`;
  }

  getAlertIcon(severity: string): string {
    const severityLower = severity?.toLowerCase() || 'minor';
    return this.severityConfig[severityLower]?.icon || 'info_outline';
  }

  getAlertTooltip(): string {
    if (this.isLoading) return 'Checking weather alerts...';
    if (this.weatherAlerts.length === 0) return 'No active alerts';
    if (this.weatherAlerts.length === 1) return this.weatherAlerts[0].event;
    return `${this.weatherAlerts.length} Active Weather Alerts`;
  }

  toggleAlerts(): void {
    if (this.weatherAlerts.length > 0) {
      this.showAlerts = !this.showAlerts;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  showAlertDetails(alert: any): void {
    this.router.navigate(['/snow-plowing-calendar']);
  }

  private rotateTestimonials(): void {
    setInterval(() => {
      this.currentTestimonialIndex =
        (this.currentTestimonialIndex + 1) % this.testimonials.length;
    }, 5000);
  }

  scrollToSection(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
