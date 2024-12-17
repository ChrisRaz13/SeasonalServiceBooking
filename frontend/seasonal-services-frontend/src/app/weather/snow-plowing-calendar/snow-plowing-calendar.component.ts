import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { WeatherService } from '../../services/weather.service';


import { AlertBannerComponent } from '../alert-banner/alert-banner.component';
import { CurrentConditionsComponent } from '../current-conditions/current-conditions.component';
import { HourlyForecastComponent } from '../hourly-forecast/hourly-forecast.component';
import { WeeklyForecastComponent } from '../weekly-forecast/weekly-forecast.component';


import {
  WeatherAlert,
  HourlyForecast,
  DayForecast,
  ChartData,
  ChartOptions,
  ServiceStatus,
  WeatherApiResponse
} from '../interfaces/weather.interfaces';

@Component({
  selector: 'app-snow-plowing-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    AlertBannerComponent,
    CurrentConditionsComponent,
    HourlyForecastComponent,
    WeeklyForecastComponent
  ],
  template: `
  <div class="dashboard-container">
    <!-- Loading State -->
    <div *ngIf="isLoading" class="loading-container" @fadeSlideInOut>
      <mat-spinner></mat-spinner>
      <p class="loading-text">Loading weather data...</p>
    </div>

    <!-- Main Content -->
    <ng-container *ngIf="!isLoading">
      <app-alert-banner
        [alerts]="weatherAlerts">
      </app-alert-banner>


      <app-current-conditions
  [snowProbability]="getCurrentSnowProbability()"
  [accumulation]="getExpectedAccumulation()"
  [groundTemp]="currentGroundTemp"
  [windSpeed]="currentWindSpeed"
  [serviceStatus]="getServiceStatus()"
  [isServiceRequired]="isServiceRequired()"
  [hourlyForecast]="hourlyForecast"
></app-current-conditions>

      <app-hourly-forecast
        [forecast]="hourlyForecast"
        [chartData]="hourlyChartData"
        [chartOptions]="hourlyChartOptions">
      </app-hourly-forecast>

      <app-weekly-forecast
        [forecast]="dailyForecast"
        (toggleDetails)="togglePeriodDetails($event)">
      </app-weekly-forecast>

      <!-- Debug Button -->
      <div style="padding: 20px; text-align: center;">
        <button mat-raised-button color="warn" (click)="debugWeatherData()">
          <mat-icon>bug_report</mat-icon>
          Debug Weather Data
        </button>
      </div>

      <button mat-raised-button
        color="primary"
        (click)="refreshData()"
        [disabled]="isLoading">
                <mat-icon>refresh</mat-icon>
            Refresh Data
        </button>

      <!-- Service Status Footer -->
      <div class="service-status-footer" *ngIf="isServiceRequired()">
        <div class="status-content">
          <mat-icon>warning</mat-icon>
          <span>Snow accumulation expected to exceed 2". Service recommended.</span>
        </div>
        <button mat-raised-button color="primary">Schedule Service</button>
      </div>
    </ng-container>
  </div>
`,
  styleUrls: ['./snow-plowing-calendar.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SnowPlowingCalendarComponent implements OnInit {
  isLoading: boolean = true;
  weatherAlerts: WeatherAlert[] = [];
  hourlyForecast: HourlyForecast[] = [];
  dailyForecast: DayForecast[] = [];
  currentGroundTemp: number = 32;
  currentWindSpeed: number = 0;
  hourlyChartData!: ChartData;
  hourlyChartOptions!: ChartOptions;

  constructor(private weatherService: WeatherService) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.loadWeatherData();
  }

  private initChartOptions(): void {
    this.hourlyChartOptions = {
      plugins: {
        legend: {
          display: true,
          labels: { color: '#ffffff' }
        }
      },
      scales: {
        'y-temp': {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.1)' },
          ticks: { color: '#ff4081' }
        },
        'y-prob': {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { display: false },
          ticks: { color: '#2196f3' }
        },
        x: {
          grid: { color: 'rgba(255,255,255,0.1)' },
          ticks: { color: '#ffffff' }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private loadWeatherData(): void {
    const lat = 41.661129;
    const lon = -91.530167;

    this.isLoading = true;
    this.weatherService.getAllWeatherData(lat, lon).subscribe({
      next: (data: WeatherApiResponse) => {
        console.log('Raw Weather Data:', data);

        this.weatherAlerts = data.alerts || [];
        this.hourlyForecast = data.hourly || [];
        this.dailyForecast = data.forecast || [];

        // Log the processed data
        console.log('Processed Hourly Forecast:', this.hourlyForecast);

        // Update current conditions
        if (this.hourlyForecast.length > 0) {
          this.currentGroundTemp = this.hourlyForecast[0].temperature;
          this.currentWindSpeed = this.hourlyForecast[0].windSpeed || 0;
        }

        this.updateCharts();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading weather data', error);
        this.isLoading = false;
      }
    });
  }

  private updateCharts(): void {
    try {
      if (!this.hourlyForecast.length) {
        console.warn('No hourly forecast data available for charts');
        return;
      }

      this.hourlyChartData = {
        labels: this.hourlyForecast.map(h => h.time),
        datasets: [
          {
            label: 'Temperature (°F)',
            data: this.hourlyForecast.map(h => h.temperature),
            borderColor: '#ff4081',
            tension: 0.4,
            yAxisID: 'y-temp'
          },
          {
            label: 'Snow Probability (%)',
            data: this.hourlyForecast.map(h => h.snowProbability),
            borderColor: '#2196f3',
            tension: 0.4,
            yAxisID: 'y-prob'
          }
        ]
      };
    } catch (error) {
      console.error('Error updating charts:', error);
    }
  }

  getCurrentSnowProbability(): number {
    return this.hourlyForecast[0]?.snowProbability || 0;
  }

  getExpectedAccumulation(): number {
    return this.hourlyForecast.reduce((acc, hour) => acc + hour.accumulation, 0);
  }

  isServiceRequired(): boolean {
    return this.getExpectedAccumulation() >= 2;
  }

  getServiceStatus(): ServiceStatus {
    const accumulation = this.getExpectedAccumulation();
    if (accumulation >= 2) return ServiceStatus.REQUIRED;
    if (accumulation >= 1) return ServiceStatus.MONITORING;
    return ServiceStatus.NOT_NEEDED;
  }

  togglePeriodDetails(period: any): void {
    period.showDetails = !period.showDetails;
  }


debugWeatherData(): void {
  const lat = 41.661129;
  const lon = -91.530167;

  this.weatherService.getAllWeatherData(lat, lon).subscribe({
    next: (data) => {
      console.log('Full Weather Response:', data);

      // Log specific data points
      if (data.hourly && data.hourly.length > 0) {
        console.log('Next 24 hours forecast:', data.hourly.slice(0, 24));
        console.log('Current Snow Probability:', data.hourly[0].snowProbability);
        console.log('Current Conditions:', this.getCurrentSnowProbability());
      }
    },
    error: (error) => {
      console.error('Debug Error:', error);
    }
  });
}


debugPrecipitationData(): void {
  const lat = 41.661129;
  const lon = -91.530167;

  this.weatherService.getAllWeatherData(lat, lon).subscribe({
    next: (data) => {
      console.log('Current Period Details:', data.hourly?.[0]);
      console.log('Next 24 Hours Snow Probabilities:',
        data.hourly?.slice(0, 24).map(hour => ({
          time: hour.time,
          snowProb: hour.snowProbability,
          shortForecast: hour.shortForecast
        }))
      );
    }
  });
}

refreshData(): void {
  this.isLoading = true;
  this.weatherService.forceUpdate().subscribe({
    next: (data) => {
      // Update your data
      this.weatherAlerts = data.alerts || [];
      this.hourlyForecast = data.hourly || [];
      this.dailyForecast = data.forecast || [];
      this.updateCharts();
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error refreshing data:', error);
      this.isLoading = false;
    }
  });
}
}
