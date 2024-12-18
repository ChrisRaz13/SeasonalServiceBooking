import { Component, OnInit, OnDestroy } from '@angular/core';
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
import {
  WeatherAlert,
  AlertSeverity,
  ServiceCard,
  WeatherUtils
} from '../../weather/interfaces/weather.interfaces';

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

      <!-- Weather Alert Button -->
      <div class="floating-alert" *ngIf="!hasError">
        <button
          class="alert-fab"
          [class.has-alerts]="hasActiveAlerts()"
          [class.is-loading]="isLoading"
          [ngClass]="getAlertSeverityClass(getHighestSeverityAlert()?.severity)"
          (click)="toggleAlerts()"
          [matTooltip]="getAlertTooltip()"
        >
          <div class="alert-icon-wrapper">
            <mat-icon class="alert-icon">{{ getAlertIcon(getHighestSeverityAlert()?.severity) }}</mat-icon>
            <span class="alert-pulse" *ngIf="hasActiveAlerts()"></span>
          </div>
          <span class="alert-count" *ngIf="hasActiveAlerts()">
            {{ getActiveAlertCount() }}
          </span>
        </button>

        <!-- Alert Panel -->
        <div class="floating-alerts-panel" *ngIf="showAlerts && hasActiveAlerts()" [@expandCollapse]>
          <div class="panel-header">
            <h3>Active Weather Alerts</h3>
            <button mat-icon-button (click)="toggleAlerts()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Weather Statements Section -->
          <div class="alert-section" *ngIf="getSpecialWeatherStatements().length > 0">
            <h4 class="section-title">Special Weather Statements</h4>
            <div class="alerts-list">
              <div *ngFor="let alert of getSpecialWeatherStatements()"
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
                <p class="alert-description">{{ alert.description }}</p>
                <div class="alert-instruction" *ngIf="alert.instruction">
                  <strong>Instructions:</strong>
                  <p>{{ alert.instruction }}</p>
                </div>
                <div class="alert-details">
                  <span class="alert-timing">
                    Effective: {{ formatDate(alert.onset || '') }}<br>
                    Expires: {{ formatDate(alert.expires) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Hazardous Weather Outlooks -->
          <div class="alert-section" *ngIf="getHazardousWeatherOutlooks().length > 0">
            <h4 class="section-title">Hazardous Weather Outlook</h4>
            <div class="alerts-list">
              <div *ngFor="let alert of getHazardousWeatherOutlooks()"
                   class="alert-item outlook-item"
                   [ngClass]="getAlertSeverityClass(alert.severity)">
                <div class="alert-item-header">
                  <mat-icon>{{ getAlertIcon(alert.severity) }}</mat-icon>
                  <div class="alert-item-title">
                    <h4>{{ alert.event }}</h4>
                    <span class="alert-severity-badge">{{ alert.severity }}</span>
                  </div>
                </div>
                <div class="outlook-content" *ngIf="alert.outlook">
                  <p class="outlook-day-one">{{ alert.outlook.dayOne }}</p>
                  <p class="outlook-extended" *ngIf="alert.outlook.extendedOutlook">
                    <strong>Extended Outlook:</strong><br>
                    {{ alert.outlook.extendedOutlook }}
                  </p>
                  <p class="spotter-info" *ngIf="alert.outlook.spotterInfo">
                    <strong>Spotter Information:</strong><br>
                    {{ alert.outlook.spotterInfo }}
                  </p>
                </div>
                <div class="alert-details">
                  <span class="alert-timing">
                    Issued: {{ formatDate(alert.onset || '') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Alerts -->
          <div class="alert-section" *ngIf="getOtherAlerts().length > 0">
            <h4 class="section-title">Other Active Alerts</h4>
            <div class="alerts-list">
              <div *ngFor="let alert of getOtherAlerts()"
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
  weatherAlerts: WeatherAlert[] = [];
  activeSeason: 'winter' | 'summer' = 'winter';
  isLoading = true;
  hasError = false;
  showAlerts = false;
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

  constructor(
    private weatherService: WeatherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWeatherAlerts();
    this.initScrollListener();
    setInterval(() => this.loadWeatherAlerts(), 300000); // Refresh every 5 minutes
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initScrollListener(): void {
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Handle scroll events if needed
      });
  }

  setActiveSeason(season: 'winter' | 'summer'): void {
    this.activeSeason = season;
  }

  loadWeatherAlerts(): void {
    const lat = 42.032974;
    const lon = -93.581543;

    this.isLoading = true;
    this.hasError = false;

    this.weatherService.getPointData(lat, lon).subscribe({
      next: (pointData: any) => {
        const gridId = pointData.properties.gridId;

        this.weatherService.getWeatherAlerts(lat, lon, gridId).subscribe({
          next: (data: any) => {
            if (data.features && data.features.length > 0) {
              this.processAlerts(data.features);
            } else {
              this.weatherAlerts = [];
            }
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error loading weather alerts:', error);
            this.hasError = true;
            this.isLoading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching point data:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  private processAlerts(features: any[]): void {
    this.weatherAlerts = features.map(feature => ({
      severity: feature.properties.severity as AlertSeverity,
      event: feature.properties.event,
      headline: feature.properties.headline,
      description: feature.properties.description,
      instruction: feature.properties.instruction,
      expires: feature.properties.expires,
      onset: feature.properties.onset,
      status: feature.properties.status,
      messageType: feature.properties.messageType,
      category: feature.properties.category,
      urgency: feature.properties.urgency,
      certainty: feature.properties.certainty,
      areaDesc: feature.properties.areaDesc,
      response: feature.properties.response,
      outlook: feature.properties.description.includes('Hazardous Weather Outlook')
        ? WeatherUtils.parseWeatherOutlook(feature.properties.description)
        : undefined
    }));

    // Sort alerts by severity
    this.weatherAlerts.sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity));
  }

  private getSeverityWeight(severity: AlertSeverity): number {
    const weights: Record<AlertSeverity, number> = {
      [AlertSeverity.EXTREME]: 4,
      [AlertSeverity.SEVERE]: 3,
      [AlertSeverity.MODERATE]: 2,
      [AlertSeverity.MINOR]: 1
    };
    return weights[severity] || 0;
  }

  getSpecialWeatherStatements(): WeatherAlert[] {
    return this.weatherAlerts.filter(alert =>
      alert.event.toLowerCase().includes('special weather statement'));
  }

  getHazardousWeatherOutlooks(): WeatherAlert[] {
    return this.weatherAlerts.filter(alert =>
      alert.event.toLowerCase().includes('hazardous weather outlook'));
  }

  getOtherAlerts(): WeatherAlert[] {
    return this.weatherAlerts.filter(alert =>
      !alert.event.toLowerCase().includes('special weather statement') &&
      !alert.event.toLowerCase().includes('hazardous weather outlook'));
  }

  hasActiveAlerts(): boolean {
    return this.weatherAlerts.length > 0;
  }

  getActiveAlertCount(): number {
    return this.weatherAlerts.length;
  }

  getHighestSeverityAlert(): WeatherAlert | undefined {
    return this.weatherAlerts[0];
  }

  getAlertSeverityClass(severity: AlertSeverity | undefined): string {
    return severity ? `severity-${severity.toLowerCase()}` : 'severity-minor';
  }

  getAlertIcon(severity: AlertSeverity | undefined): string {
    switch (severity) {
      case AlertSeverity.EXTREME:
        return 'warning';
      case AlertSeverity.SEVERE:
        return 'error';
      case AlertSeverity.MODERATE:
        return 'info';
      case AlertSeverity.MINOR:
      default:
        return 'info_outline';
    }
  }

  getAlertTooltip(): string {
    if (this.isLoading) return 'Checking weather alerts...';
    if (!this.hasActiveAlerts()) return 'No active alerts';
    if (this.weatherAlerts.length === 1) return this.weatherAlerts[0].event;
    return `${this.weatherAlerts.length} Active Weather Alerts`;
  }

  toggleAlerts(): void {
    if (this.hasActiveAlerts()) {
      this.showAlerts = !this.showAlerts;
    }
  }

  formatDate(dateString: string): string {
    return WeatherUtils.formatDate(dateString);
  }

  showAlertDetails(alert: WeatherAlert): void {
    this.router.navigate(['/snow-plowing-calendar']);
  }

  scrollToSection(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
