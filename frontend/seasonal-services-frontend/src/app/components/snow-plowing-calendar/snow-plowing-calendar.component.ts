import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChartModule } from 'primeng/chart';
import { trigger, transition, style, animate } from '@angular/animations';
import { WeatherService } from '../../services/weather.service';
import { gsap } from 'gsap';

// Interfaces
interface WeatherPeriod {
  timeOfDay: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
  icon: string;
  showDetails?: boolean;
}

interface ForecastDay {
  date: string;
  rawDate: Date;
  periods: WeatherPeriod[];
  tempHigh: number | null;
  tempLow: number | null;
  shortForecast?: string;
}

interface HourlyForecastItem {
  isDateSeparator: boolean;
  date?: string;
  time?: string;
  temperature?: string;
  windSpeed?: string;
  shortForecast?: string;
  snowChance?: number;
  snowAccumulation?: number;
}

interface WeatherAlert {
  event: string;
  headline: string;
  description: string;
  instruction: string | null;
  severity: string;
  effective: string;
  expires: string;
  senderName: string;
  areaDesc: string;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
    fill: boolean;
    backgroundColor: string;
    yAxisID?: string;
  }>;
}

interface SnowData {
  time: string;
  chance: number;
  accumulation: number;
  temperature: number;
}

@Component({
  selector: 'app-snow-plowing-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ChartModule
  ],
  templateUrl: './snow-plowing-calendar.component.html',
  styleUrls: ['./snow-plowing-calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
})
export class SnowPlowingCalendarComponent implements OnInit, AfterViewInit {
  weatherForecast: ForecastDay[] = [];
  hourlyForecast: HourlyForecastItem[] = [];
  weatherAlerts: WeatherAlert[] = [];
  isLoading = true;
  hasError = false;
  temperatureData!: ChartData;
  temperatureOptions: any;
  snowChartData!: ChartData;
  snowChartOptions: any;
  lastUpdated: Date = new Date();

  constructor(private weatherService: WeatherService) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.loadWeatherData();
  }

  ngAfterViewInit() {
    this.initParticles();
    this.initAnimations();
  }

  private initParticles() {
    if (typeof window !== 'undefined' && 'particlesJS' in window) {
      (window as any).particlesJS('particles-js', {
        particles: {
          number: { value: 80 },
          color: { value: '#29b6f6' },
          opacity: { value: 0.5 },
          size: { value: 3 },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#29b6f6',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out'
          }
        }
      });
    }
  }

  private initAnimations() {
    gsap.to('.weather-card', {
      duration: 0.8,
      y: 0,
      opacity: 1,
      stagger: 0.2,
      ease: "power2.out",
      from: { y: 30, opacity: 0 }
    });
  }

  private initChartOptions() {
    const commonOptions = {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255,255,255,0.1)',
            drawBorder: false
          },
          ticks: { color: '#e1f5fe' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#e1f5fe' }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    this.temperatureOptions = {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          title: {
            display: true,
            text: 'Temperature (°F)',
            color: '#ffeb3b'
          }
        }
      }
    };

    this.snowChartOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#ffffff' }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          callbacks: {
            label: (context: any) => {
              if (context.dataset.yAxisID === 'chance') {
                return `Snow Chance: ${context.raw}%`;
              } else if (context.dataset.yAxisID === 'accumulation') {
                return `Expected Snow: ${context.raw}"`;
              }
              return context.raw;
            }
          }
        }
      },
      scales: {
        chance: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Snow Chance (%)',
            color: '#29b6f6'
          },
          ticks: {
            color: '#29b6f6',
            callback: (value: number) => `${value}%`
          },
          grid: {
            color: 'rgba(255,255,255,0.1)'
          }
        },
        accumulation: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Expected Snow (inches)',
            color: '#ff7043'
          },
          ticks: {
            color: '#ff7043',
            callback: (value: number) => `${value}"`
          },
          grid: {
            display: false
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#e1f5fe' }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  loadWeatherData(): void {
    this.isLoading = true;
    this.hasError = false;

    const lat = 42.032974;
    const lon = -93.581543;

    this.weatherService.getAllWeatherData(lat, lon).subscribe({
      next: (data) => {
        this.processForecastData(data.forecast);
        this.processHourlyData(data.hourly);
        this.processAlertsData(data.alerts);
        this.updateCharts();
        this.isLoading = false;
        this.lastUpdated = new Date();
      },
      error: (error) => {
        console.error('Error loading weather data', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  processForecastData(data: any): void {
    if (!data?.properties?.periods) {
      this.hasError = true;
      return;
    }

    const forecastMap = new Map<string, ForecastDay>();

    data.properties.periods.forEach((period: any) => {
      const date = new Date(period.startTime);
      const dateKey = date.toDateString();
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      if (!forecastMap.has(dateKey)) {
        forecastMap.set(dateKey, {
          date: dateStr,
          rawDate: date,
          periods: [],
          tempHigh: null,
          tempLow: null,
          shortForecast: period.shortForecast
        });
      }

      const dayForecast = forecastMap.get(dateKey)!;
      const weatherPeriod: WeatherPeriod = {
        timeOfDay: period.name,
        isDaytime: period.isDaytime,
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        windSpeed: period.windSpeed,
        windDirection: period.windDirection,
        shortForecast: period.shortForecast,
        detailedForecast: period.detailedForecast,
        icon: period.icon,
        showDetails: false
      };

      dayForecast.periods.push(weatherPeriod);

      if (period.isDaytime) {
        dayForecast.tempHigh = period.temperature;
      } else {
        dayForecast.tempLow = period.temperature;
      }
    });

    this.weatherForecast = Array.from(forecastMap.values());
  }

  processHourlyData(data: any): void {
    if (!data?.properties?.periods) {
      this.hasError = true;
      return;
    }

    const now = new Date();
    const hourlyData: HourlyForecastItem[] = [];
    let previousDate: string | null = null;

    data.properties.periods
      .filter((period: any) => new Date(period.startTime) >= now)
      .forEach((period: any) => {
        const periodDate = new Date(period.startTime);
        const dateStr = periodDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        if (dateStr !== previousDate) {
          hourlyData.push({
            isDateSeparator: true,
            date: dateStr,
          });
          previousDate = dateStr;
        }

        let temperature = period.temperature;
        if (period.temperatureUnit === 'C') {
          temperature = (temperature * 9) / 5 + 32;
        }

        hourlyData.push({
          isDateSeparator: false,
          time: periodDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          }),
          temperature: `${temperature.toFixed(1)}°F`,
          windSpeed: period.windSpeed,
          shortForecast: period.shortForecast,
          snowChance: this.extractSnowChance(period.shortForecast),
          snowAccumulation: this.extractHourlyAccumulation(period.shortForecast),
        });
      });

    this.hourlyForecast = hourlyData;
  }

  processAlertsData(data: any): void {
    if (data.features && data.features.length > 0) {
      this.weatherAlerts = data.features.map((feature: any) => ({
        event: feature.properties.event,
        headline: feature.properties.headline,
        description: feature.properties.description,
        instruction: feature.properties.instruction,
        severity: feature.properties.severity,
        effective: feature.properties.effective,
        expires: feature.properties.expires,
        senderName: feature.properties.senderName,
        areaDesc: feature.properties.areaDesc,
      }));
    } else {
      this.weatherAlerts = [];
    }
  }

  private updateCharts() {
    const next24Hours = this.processNext24Hours();

    this.temperatureData = {
      labels: next24Hours.map(hour => hour.time),
      datasets: [{
        label: 'Temperature (°F)',
        data: next24Hours.map(hour => hour.temperature),
        borderColor: '#ff6384',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }]
    };

    this.snowChartData = {
      labels: next24Hours.map(hour => hour.time),
      datasets: [
        {
          label: 'Snow Chance',
          data: next24Hours.map(hour => hour.chance),
          borderColor: '#6ab4ff',
          backgroundColor: 'rgba(106, 180, 255, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'chance'
        },
        {
          label: 'Expected Snow',
          data: next24Hours.map(hour => hour.accumulation),
          borderColor: '#fff',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'accumulation'
        }
      ]
    };
  }

  private processNext24Hours(): SnowData[] {
    return this.hourlyForecast
      .filter(hour => !hour.isDateSeparator)
      .slice(0, 24)
      .map(hour => {
        const forecast = hour.shortForecast?.toLowerCase() || '';
        return {
          time: hour.time || '',
          chance: this.extractSnowChance(forecast),
          accumulation: this.extractHourlyAccumulation(forecast),
          temperature: this.extractTemperature(hour.temperature || '')
        };
      });
  }

  public extractSnowChance(forecast: string): number {
    if (forecast.includes('likely')) return 70;
    if (forecast.includes('chance')) return 50;
    if (forecast.includes('slight chance')) return 30;
    if (forecast.includes('snow')) return 90;
    return 0;
  }

  public extractHourlyAccumulation(forecast: string): number {
    const matches = forecast.match(/(\d+(?:\.\d+)?)\s*(?:to\s*(\d+(?:\.\d+)?))?\s*inches?/i);
    if (!matches) return 0;

    if (matches[2]) {
      return (parseFloat(matches[1]) + parseFloat(matches[2])) / 2;
    }
    return parseFloat(matches[1]);
  }

  private extractTemperature(temp: string): number {
    return parseFloat(temp.replace('°F', ''));
  }

  getWeatherEmoji(description: string): string {
    description = description.toLowerCase();
    if (description.includes('snow')) return '❄️';
    if (description.includes('rain')) return '🌧️';
    if (description.includes('cloud')) return '☁️';
    if (description.includes('sun') || description.includes('clear')) return '☀️';
    if (description.includes('fog')) return '🌫️';
    if (description.includes('thunder')) return '⛈️';
    return '🌤️';
  }

  getSeverityColor(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'extreme': return 'rgb(150, 0, 0)';
      case 'severe': return 'rgb(255, 0, 0)';
      case 'moderate': return 'rgb(255, 165, 0)';
      default: return 'rgb(255, 255, 0)';
    }
  }

  getDayName(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  }

  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  toggleDetails(period: WeatherPeriod): void {
    period.showDetails = !period.showDetails;
  }

  hasSnowInfo(period: WeatherPeriod): boolean {
    return period.shortForecast.toLowerCase().includes('snow') ||
           period.detailedForecast.toLowerCase().includes('snow');
  }

  getServiceStatus(): string {
    const accumulation = this.getSnowAccumulation();
    if (parseFloat(accumulation) >= 2) return 'Active';
    if (parseFloat(accumulation) >= 1.5) return 'Pending';
    return 'Standby';
  }

  getServiceStatusClass(): string {
    const status = this.getServiceStatus();
    return `status-${status.toLowerCase()}`;
  }

  showServiceNotice(): boolean {
    const accumulation = parseFloat(this.getSnowAccumulation());
    return accumulation >= 1.5 && accumulation < 2;
  }

  getSnowProbability(): number {
    const next12Hours = this.hourlyForecast
      .filter(hour => !hour.isDateSeparator)
      .slice(0, 12);

    const snowyHours = next12Hours.filter(hour =>
      hour.shortForecast?.toLowerCase().includes('snow'));

    return Math.round((snowyHours.length / 12) * 100);
  }

  getSnowAccumulation(): string {
    const forecast = this.weatherForecast
      .flatMap(day => day.periods)
      .find(period =>
        period.detailedForecast.toLowerCase().includes('snow') ||
        period.shortForecast.toLowerCase().includes('snow')
      );

    if (!forecast) return '0';

    const detailedAccumulation = this.parseAccumulation(forecast.detailedForecast);
    if (detailedAccumulation > 0) {
      return detailedAccumulation.toFixed(1);
    }

    const shortAccumulation = this.parseAccumulation(forecast.shortForecast);
    return shortAccumulation.toFixed(1);
  }

  private parseAccumulation(forecast: string): number {
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(?:to\s*(\d+(?:\.\d+)?))?\s*inch(?:es)?/i,
      /accumulation(?:s)?\s*of\s*(\d+(?:\.\d+)?)\s*(?:to\s*(\d+(?:\.\d+)?))?\s*inch(?:es)?/i
    ];

    for (const pattern of patterns) {
      const matches = forecast.match(pattern);
      if (matches) {
        if (matches[2]) {
          return (parseFloat(matches[1]) + parseFloat(matches[2])) / 2;
        }
        return parseFloat(matches[1]);
      }
    }

    if (forecast.toLowerCase().includes('snow')) {
      if (forecast.toLowerCase().includes('heavy')) return 4;
      if (forecast.toLowerCase().includes('moderate')) return 2;
      if (forecast.toLowerCase().includes('light')) return 1;
    }

    return 0;
  }

  getGroundTemperature(): number {
    const currentTemp = this.hourlyForecast
      .find(hour => !hour.isDateSeparator)?.temperature;

    if (!currentTemp) return 32;
    return Math.round(parseFloat(currentTemp.replace('°F', '')));
  }
}
