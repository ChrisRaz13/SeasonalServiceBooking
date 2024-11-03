import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChartModule } from 'primeng/chart';
import { trigger, transition, style, animate } from '@angular/animations';
import { WeatherService } from '../../services/weather.service';

interface WeatherAlert {
  severity: string;
  event: string;
  headline: string;
  description: string;
  expires: string;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  snowProbability: number;
  accumulation: number;
  windSpeed: number;
}

interface WeatherPeriod {
  temperature: number;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
  snowProbability: number;
  snowAmount: number;
  showDetails: boolean;
}

interface DayForecast {
  date: string;
  dayOfWeek: string;
  highTemp: number;
  lowTemp: number | null;
  dayPeriod: WeatherPeriod;
  nightPeriod?: WeatherPeriod;
}

@Component({
  selector: 'app-snow-plowing-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ChartModule
  ],
  templateUrl: './snow-plowing-calendar.component.html',
  styleUrls: ['./snow-plowing-calendar.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class SnowPlowingCalendarComponent implements OnInit, AfterViewInit {
  alerts: WeatherAlert[] = [];
  hourlyForecast: HourlyForecast[] = [];
  dailyForecast: DayForecast[] = [];
  currentGroundTemp: number = 32;
  currentWindSpeed: number = 0;
  hourlyChartData: any;
  hourlyChartOptions: any;
  isLoading: boolean = true;

  constructor(private weatherService: WeatherService) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.loadWeatherData();
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  private loadWeatherData(): void {
    const lat = 42.032974;
    const lon = -93.581543;

    this.isLoading = true;  // Set loading to true when starting
    this.weatherService.getAllWeatherData(lat, lon).subscribe({
      next: (data) => {
        this.processWeatherData(data);
        this.updateCharts();
        this.isLoading = false;  // Set loading to false when done
      },
      error: (error) => {
        console.error('Error loading weather data', error);
        this.isLoading = false;  // Set loading to false on error
      }
    });
  }

  private processWeatherData(data: any): void {
    // Process alerts
    if (data.alerts?.features) {
      this.alerts = data.alerts.features.map((feature: any) => ({
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

    // Process daily forecast
    if (data.forecast?.properties?.periods) {
      const dailyData = data.forecast.properties.periods;
      this.dailyForecast = [];

      for (let i = 0; i < dailyData.length; i += 2) {
        const dayPeriod = dailyData[i];
        const nightPeriod = dailyData[i + 1];

        if (dayPeriod) {
          const processedDay: WeatherPeriod = {
            temperature: dayPeriod.temperature,
            windSpeed: dayPeriod.windSpeed,
            windDirection: dayPeriod.windDirection,
            shortForecast: dayPeriod.shortForecast,
            detailedForecast: dayPeriod.detailedForecast,
            snowProbability: this.calculateSnowProbability(dayPeriod.shortForecast),
            snowAmount: this.extractSnowAccumulation(dayPeriod.detailedForecast),
            showDetails: false
          };

          let dayForecast: DayForecast = {
            date: dayPeriod.startTime,
            dayOfWeek: new Date(dayPeriod.startTime).toLocaleDateString('en-US', {
              weekday: 'short'
            }),
            highTemp: dayPeriod.temperature,
            lowTemp: nightPeriod ? nightPeriod.temperature : null,
            dayPeriod: processedDay
          };

          if (nightPeriod) {
            dayForecast.nightPeriod = {
              temperature: nightPeriod.temperature,
              windSpeed: nightPeriod.windSpeed,
              windDirection: nightPeriod.windDirection,
              shortForecast: nightPeriod.shortForecast,
              detailedForecast: nightPeriod.detailedForecast,
              snowProbability: this.calculateSnowProbability(nightPeriod.shortForecast),
              snowAmount: this.extractSnowAccumulation(nightPeriod.detailedForecast),
              showDetails: false
            };
          }

          this.dailyForecast.push(dayForecast);
        }
      }
    }

    // Update current conditions
    if (this.hourlyForecast.length > 0) {
      this.currentGroundTemp = this.hourlyForecast[0].temperature;
      this.currentWindSpeed = this.hourlyForecast[0].windSpeed;
    }
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

  private initCharts(): void {
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

  getServiceStatus(): string {
    const accumulation = this.getExpectedAccumulation();
    if (accumulation >= 2) return 'Service Required';
    if (accumulation >= 1) return 'Monitor Conditions';
    return 'No Service Needed';
  }

  getTemperatureNote(): string {
    if (this.currentGroundTemp <= 32) return 'Snow Accumulation Likely';
    return 'Snow May Not Stick';
  }

  getWindNote(): string {
    if (this.currentWindSpeed >= 15) return 'Drifting Possible';
    return 'Minimal Drifting';
  }

  getWeatherIcon(forecast: string): string {
    forecast = forecast.toLowerCase();
    if (forecast.includes('snow')) return 'ac_unit';
    if (forecast.includes('rain')) return 'water_drop';
    if (forecast.includes('cloud')) return 'cloud';
    if (forecast.includes('sun') || forecast.includes('clear')) return 'wb_sunny';
    if (forecast.includes('wind')) return 'air';
    if (forecast.includes('fog')) return 'cloud';
    if (forecast.includes('thunder')) return 'flash_on';
    return 'wb_sunny';
  }

  togglePeriodDetails(period: WeatherPeriod): void {
    period.showDetails = !period.showDetails;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  formatShortDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
