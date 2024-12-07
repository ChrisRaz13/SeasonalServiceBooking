import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { WeatherService } from '../../services/weather.service';

// Component imports
import { AlertBannerComponent } from '../alert-banner/alert-banner.component';
import { CurrentConditionsComponent } from '../current-conditions/current-conditions.component';
import { HourlyForecastComponent } from '../hourly-forecast/hourly-forecast.component';
import { WeeklyForecastComponent } from '../weekly-forecast/weekly-forecast.component';

// Interfaces
import {
  WeatherAlert,
  HourlyForecast,
  DayForecast,
  WeatherPeriod,
  ChartData,
  ChartOptions,
  ServiceStatus
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
          [isServiceRequired]="isServiceRequired()">
        </app-current-conditions>

        <app-hourly-forecast
          [forecast]="hourlyForecast"
          [chartData]="hourlyChartData"
          [chartOptions]="hourlyChartOptions">
        </app-hourly-forecast>

        <app-weekly-forecast
          [forecast]="dailyForecast"
          (toggleDetails)="togglePeriodDetails($event)">
        </app-weekly-forecast>

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
      next: (data) => {
        this.processWeatherData(data);
        this.updateCharts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading weather data', error);
        this.isLoading = false;
      }
    });
  }

  private processWeatherData(data: any): void {
    // Process alerts
    if (data.alerts?.features) {
      this.weatherAlerts = data.alerts.features.map((feature: any) => ({
        severity: feature.properties.severity,
        event: feature.properties.event,
        headline: feature.properties.headline,
        description: feature.properties.description,
        expires: feature.properties.expires
      }));
    }

    // Process hourly forecast
    if (data.hourly?.properties?.periods) {
      this.hourlyForecast = data.hourly.properties.periods
        .slice(0, 24)
        .map((period: any) => ({
          time: new Date(period.startTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
          }),
          temperature: period.temperature,
          snowProbability: this.calculateSnowProbability(period.shortForecast),
          accumulation: this.extractSnowAccumulation(period.shortForecast),
          windSpeed: this.extractWindSpeed(period.windSpeed)
        }));
    }

    // Update current conditions
    if (this.hourlyForecast.length > 0) {
      this.currentGroundTemp = this.hourlyForecast[0].temperature;
      this.currentWindSpeed = this.hourlyForecast[0].windSpeed;
    }

    // Process daily forecast
    this.processWeeklyForecast(data.forecast?.properties?.periods || []);
  }

  private processWeeklyForecast(periods: any[]): void {
    this.dailyForecast = [];
    for (let i = 0; i < periods.length; i += 2) {
      const dayPeriod = periods[i];
      const nightPeriod = periods[i + 1];

      if (dayPeriod) {
        const forecast: DayForecast = {
          date: dayPeriod.startTime,
          dayOfWeek: new Date(dayPeriod.startTime).toLocaleDateString('en-US', {
            weekday: 'short'
          }),
          highTemp: dayPeriod.temperature,
          lowTemp: nightPeriod ? nightPeriod.temperature : null,
          dayPeriod: this.createWeatherPeriod(dayPeriod),
          nightPeriod: nightPeriod ? this.createWeatherPeriod(nightPeriod) : undefined
        };
        this.dailyForecast.push(forecast);
      }
    }
  }

  private createWeatherPeriod(period: any): WeatherPeriod {
    return {
      temperature: period.temperature,
      windSpeed: period.windSpeed,
      windDirection: period.windDirection,
      shortForecast: period.shortForecast,
      detailedForecast: period.detailedForecast,
      snowProbability: this.calculateSnowProbability(period.shortForecast),
      snowAmount: this.extractSnowAccumulation(period.detailedForecast),
      showDetails: false,
      timeOfDay: period.name,
      isDaytime: period.isDaytime,
      temperatureUnit: period.temperatureUnit
    };
  }

  private updateCharts(): void {
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
  }

  private calculateSnowProbability(forecast: string): number {
    forecast = forecast.toLowerCase();
    if (forecast.includes('heavy snow')) return 90;
    if (forecast.includes('snow likely')) return 70;
    if (forecast.includes('chance of snow')) return 50;
    if (forecast.includes('slight chance of snow')) return 30;
    if (forecast.includes('snow')) return 40;
    return 0;
  }

  private extractSnowAccumulation(forecast: string): number {
    const matches = forecast.match(/(\d+(?:\.\d+)?)\s*(?:to\s*(\d+(?:\.\d+)?))?\s*inches?/i);
    if (!matches) return 0;

    if (matches[2]) {
      return (parseFloat(matches[1]) + parseFloat(matches[2])) / 2;
    }
    return parseFloat(matches[1]);
  }

  private extractWindSpeed(windSpeed: string): number {
    const matches = windSpeed.match(/(\d+)/);
    return matches ? parseInt(matches[1]) : 0;
  }

  getCurrentSnowProbability(): number {
    return this.hourlyForecast[0]?.snowProbability || 0;
  }

  getExpectedAccumulation(): number {
    return this.hourlyForecast
      .reduce((acc, hour) => acc + hour.accumulation, 0);
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

  togglePeriodDetails(period: WeatherPeriod): void {
    period.showDetails = !period.showDetails;
  }
}
