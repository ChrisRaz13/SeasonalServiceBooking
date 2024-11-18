import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { animate, style, transition, trigger } from '@angular/animations';
import { WeatherService } from '../../services/weather.service';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface WeatherAlertSeverity {
  label: string;
  color: string;
  icon: string;
  bgColor: string;
  pulseColor: string;
}

interface ServiceFeature {
  icon: string;
  text: string;
}

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  features: string[];
  link: string;
  buttonText: string;
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
  template: `
    <div class="homepage-container" [attr.data-season]="activeSeason">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="seasonal-effects"></div>
        <div class="hero-content" [@fadeInOut]>
          <h1>Professional Snow & Lawn Services in Iowa City</h1>
          <p class="hero-subtitle">Year-Round Property Excellence Since 2010</p>
          <div class="hero-cta">
            <button mat-raised-button color="primary" routerLink="/quote">
              <mat-icon>calculate</mat-icon>
              Get a Free Quote
            </button>
            <button mat-stroked-button (click)="scrollToSection('services')" class="explore-btn">
              <mat-icon>explore</mat-icon>
              Explore Services
            </button>
          </div>
        </div>
        <div class="scroll-indicator">
          <div class="mouse"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      <!-- Service Selection -->
      <section class="service-selection">
        <div class="toggle-container">
          <button
            class="service-button winter"
            [class.active]="activeSeason === 'winter'"
            (click)="setActiveSeason('winter')"
          >
            <div class="button-content">
              <mat-icon class="season-icon">ac_unit</mat-icon>
              <h3>Snow Removal Services</h3>
              <p>Professional snow management for Iowa winters</p>
            </div>
            <div class="snow-overlay"></div>
          </button>

          <button
            class="service-button summer"
            [class.active]="activeSeason === 'summer'"
            (click)="setActiveSeason('summer')"
          >
            <div class="button-content">
              <mat-icon class="season-icon">grass</mat-icon>
              <h3>Lawn Care Services</h3>
              <p>Complete lawn maintenance solutions</p>
            </div>
            <div class="leaf-overlay"></div>
          </button>
        </div>
      </section>

      <!-- Service Content -->
      <section class="services-showcase" [ngClass]="activeSeason">
        <!-- Winter Services -->
        <div *ngIf="activeSeason === 'winter'" class="service-content winter-content" [@contentAnimation]>
          <h2 class="section-title">Professional Snow Management</h2>
          <div class="service-grid">
            <div class="service-card" *ngFor="let service of snowServices">
              <mat-icon class="service-icon">{{service.icon}}</mat-icon>
              <h3>{{service.title}}</h3>
              <p>{{service.description}}</p>
              <ul class="feature-list">
                <li *ngFor="let feature of service.features">
                  <mat-icon>check_circle</mat-icon>
                  <span>{{feature}}</span>
                </li>
              </ul>
              <button mat-raised-button color="primary" [routerLink]="service.link">
                {{service.buttonText}}
              </button>
            </div>
          </div>
        </div>

        <!-- Summer Services -->
        <div *ngIf="activeSeason === 'summer'" class="service-content summer-content" [@contentAnimation]>
          <h2 class="section-title">Complete Lawn Care Solutions</h2>
          <div class="service-grid">
            <div class="service-card" *ngFor="let service of lawnServices">
              <mat-icon class="service-icon">{{service.icon}}</mat-icon>
              <h3>{{service.title}}</h3>
              <p>{{service.description}}</p>
              <ul class="feature-list">
                <li *ngFor="let feature of service.features">
                  <mat-icon>check_circle</mat-icon>
                  <span>{{feature}}</span>
                </li>
              </ul>
              <button mat-raised-button color="accent" [routerLink]="service.link">
                {{service.buttonText}}
              </button>
            </div>
          </div>
        </div>
      </section>

       <!-- Weather Info Promo Section -->
       <section class="weather-info-promo">
        <div class="promo-content">
          <h3>Stay Ahead of the Weather!</h3>
          <p>
            Our team keeps you updated with the latest weather forecasts to help you plan for snow removal and lawn care.
            Get real-time updates on snowfall, temperature changes, and more to ensure your property is always prepared.
            <br><br>The corner icon provides any important weather alert warnings in the area
          </p>
          <a href="/weather-dashboard" class="promo-button">View Weather Dashboard</a>
        </div>
      </section>

      <!-- Weather Alert Button -->
      <div class="floating-alert" *ngIf="!hasError">
        <button
          class="alert-fab"
          [class.has-alerts]="weatherAlerts.length > 0"
          [class.is-loading]="isLoading"
          [ngClass]="getAlertSeverityClass(weatherAlerts[0]?.severity)"
          (click)="toggleAlerts()"
          [matTooltip]="getAlertTooltip()"
        >
          <div class="alert-icon-wrapper">
            <mat-icon class="alert-icon">{{ getAlertIcon(weatherAlerts[0]?.severity) }}</mat-icon>
            <span class="alert-pulse" *ngIf="weatherAlerts.length > 0"></span>
          </div>
          <span class="alert-count" *ngIf="weatherAlerts.length > 0">{{ weatherAlerts.length }}</span>
        </button>

        <!-- Alert Panel -->
        <div class="floating-alerts-panel" *ngIf="showAlerts && weatherAlerts.length > 0" [@expandCollapse]>
          <div class="panel-header">
            <h3>Active Weather Alerts</h3>
            <button mat-icon-button (click)="toggleAlerts()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="alerts-list">
            <div *ngFor="let alert of weatherAlerts"
                 class="alert-item"
                 [ngClass]="getAlertSeverityClass(alert.severity)">
              <div class="alert-item-header">
                <mat-icon>{{ getAlertIcon(alert.severity) }}</mat-icon>
                <div class="alert-item-title">
                  <h4>{{ alert.event }}</h4>
                  <span class="alert-severity-badge">{{ alert.severity }}</span>
                </div>
              </div>
              <p class="alert-headline">{{ alert.headline }}</p>
              <div class="alert-details">
                <span class="alert-timing">
                  Expires: {{ formatDate(alert.expires) }}
                </span>
                <button mat-button color="primary" (click)="showAlertDetails(alert)">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('contentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }))
      ])
    ])
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  weatherAlerts: any[] = [];
  activeSeason: 'winter' | 'summer' = 'winter';
  isLoading = true;
  hasError = false;
  showAlerts = false;
  scrollY = 0;
  snowflakes: Array<{ id: number; left: number; animationDuration: number; }> = [];
  private destroy$ = new Subject<void>();

  // Service Data
  snowServices: ServiceCard[] = [
    {
      icon: 'home',
      title: 'Residential Snow Removal',
      description: 'Serving Iowa City neighborhoods with advanced snow clearing technology. Our efficient equipment and experienced team ensure your driveway and walkways are clear and safe, typically completing most residential jobs in under 15 minutes.',
      features: [
        'Quick response during snowfall',
        'Property-safe snow removal techniques',
        'Walkway and entrance clearing'
      ],
      link: '/quote',
      buttonText: 'Get Started'
    },
    {
      icon: 'business',
      title: 'Commercial Snow Management',
      description: 'Comprehensive snow removal solutions for Iowa City businesses. We understand the importance of maintaining safe, accessible premises for your customers and employees throughout winter.',
      features: [
        '24/7 snow monitoring and response',
        'Parking lot clearing and maintenance',
        'Snow hauling services available'
      ],
      link: '/commercial',
      buttonText: 'Learn More'
    },
    {
      icon: 'house',
      title: 'HOA & Private Road Services',
      description: 'Specialized service for homeowners associations and private roads in the Iowa City area. We maintain clear, safe roadways throughout the winter season.',
      features: [
        'Full-width road clearing',
        'Driveway entrance maintenance',
        'Custom service schedules'
      ],
      link: '/hoa',
      buttonText: 'Request Service'
    },
    {
      icon: 'ac_unit',
      title: 'Ice Management & Prevention',
      description: 'Proactive ice control solutions to keep your property safe during Iowa winters. We use environmentally conscious de-icing methods and materials.',
      features: [
        'Pre-treatment services',
        'Premium ice melt application',
        '24/7 ice monitoring'
      ],
      link: '/ice-control',
      buttonText: 'Learn More'
    }
  ];

  lawnServices: ServiceCard[] = [
    {
      icon: 'grass',
      title: 'Regular Lawn Maintenance',
      description: 'Comprehensive lawn care services tailored to Iowa City\'s climate. We maintain your lawn\'s health and appearance throughout the growing season.',
      features: [
        'Weekly mowing services',
        'Edge trimming & cleanup',
        'Flexible service schedules'
      ],
      link: '/lawn-care',
      buttonText: 'Schedule Service'
    },
    {
      icon: 'event',
      title: 'Seasonal Lawn Services',
      description: 'Comprehensive seasonal care to keep your lawn healthy year-round. From spring cleanup to fall preparation, we\'ve got you covered.',
      features: [
        'Spring/Fall cleanup',
        'Fertilization programs',
        'Weed control services'
      ],
      link: '/seasonal',
      buttonText: 'View Programs'
    },
    {
      icon: 'yard',
      title: 'Professional Landscaping',
      description: 'Transform your outdoor space with our professional landscaping services. We create beautiful, sustainable landscapes suited to Iowa\'s climate.',
      features: [
        'Custom design services',
        'Native plant installation',
        'Hardscape features'
      ],
      link: '/landscaping',
      buttonText: 'Start Planning'
    },
    {
      icon: 'storefront',
      title: 'Commercial Property Maintenance',
      description: 'Professional grounds maintenance for Iowa City businesses. Keep your commercial property looking its best year-round.',
      features: [
        'Custom maintenance plans',
        'Large area management',
        'Professional appearance guarantee'
      ],
      link: '/commercial',
      buttonText: 'Request Quote'
    }
  ];

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

  constructor(
    private weatherService: WeatherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWeatherAlerts();
    this.initScrollListener();
    this.generateSnowflakes();
    setInterval(() => this.loadWeatherAlerts(), 300000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initScrollListener(): void {
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.scrollY = window.scrollY;
      });
  }

  setActiveSeason(season: 'winter' | 'summer'): void {
    this.activeSeason = season;
    if (season === 'winter') {
      this.generateSnowflakes();
    } else {
      this.snowflakes = [];
    }
  }

  private generateSnowflakes(): void {
    this.snowflakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 3 + Math.random() * 5
    }));
  }

  loadWeatherAlerts(): void {
    const lat = 42.032974;
    const lon = -93.581543;

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

  scrollToSection(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setActiveService(service: 'snow' | 'lawn'): void {
    const container = document.querySelector('.homepage-container');
    container?.setAttribute('data-active-service', service);
  }
}
