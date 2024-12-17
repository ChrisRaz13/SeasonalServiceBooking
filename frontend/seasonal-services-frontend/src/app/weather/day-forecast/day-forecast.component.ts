import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DayForecast,
  WeatherPeriod,
  ServiceStatus,
  WeatherUtils
} from '../interfaces/weather.interfaces';

@Component({
  selector: 'app-day-forecast',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './day-forecast.component.html',
  styleUrls: ['./day-forecast.component.css']
})
export class DayForecastComponent {
  @Input() forecast!: DayForecast;
  @Input() isToday = false;
  @Output() toggleDetails = new EventEmitter<WeatherPeriod>();

  // Add ServiceStatus enum for template access
  ServiceStatus = ServiceStatus;

  formatPeriodHeader(period: WeatherPeriod): string {
    if (this.isToday) {
      return period.isDaytime ? 'Today' : 'Tonight';
    }
    return period.isDaytime ? this.forecast.dayOfWeek : `${this.forecast.dayOfWeek} Night`;
  }

  getPrecipitationDetails(period: WeatherPeriod): string {
    const forecast = period.detailedForecast.toLowerCase();
    let details = '';

    if (period.snowProbability > 0) {
      details = `${period.snowProbability}% chance of snow`;
      if (period.snowAmount > 0) {
        details += ` (${period.snowAmount}" expected)`;
      }
    } else if (forecast.includes('rain')) {
      const chance = this.extractPrecipitationChance(period.detailedForecast);
      if (chance > 0) {
        details = `${chance}% chance of rain`;
      }
    }

    return details;
  }

  private extractPrecipitationChance(forecast: string): number {
    const match = forecast.match(/chance of precipitation is (\d+)%/i);
    return match ? parseInt(match[1]) : 0;
  }

  getServiceStatus(period: WeatherPeriod): ServiceStatus {
    if (period.snowProbability > 30) {
      return ServiceStatus.MONITORING;
    }
    if (period.snowAmount >= 2) {
      return ServiceStatus.REQUIRED;
    }
    return ServiceStatus.NOT_NEEDED;
  }

  getWindDescription(speed: string, direction: string): string {
    const windSpeed = WeatherUtils.extractWindSpeed(speed);
    if (windSpeed === 0) {
      return 'Calm';
    }
    return `${direction} ${speed}`;
  }

  shouldHighlightWind(speed: string): boolean {
    const windSpeed = WeatherUtils.extractWindSpeed(speed);
    return windSpeed > 15; // Highlight strong winds
  }

  getStatusColor(status: ServiceStatus): string {
    switch (status) {
      case ServiceStatus.REQUIRED:
        return 'service-required';
      case ServiceStatus.MONITORING:
        return 'service-monitoring';
      default:
        return '';
    }
  }

  formatTemperature(temp: number): string {
    return `${Math.round(temp)}°`;
  }

  getWeatherIcon(forecast: string): string {
    const f = forecast.toLowerCase();
    if (f.includes('snow')) return 'ac_unit';
    if (f.includes('rain')) return 'water_drop';
    if (f.includes('cloud')) return 'cloud';
    if (f.includes('sun') || f.includes('clear')) return 'wb_sunny';
    if (f.includes('wind') || f.includes('gust')) return 'air';
    if (f.includes('fog')) return 'cloud';
    if (f.includes('thunder')) return 'thunderstorm';
    return 'wb_sunny';
  }
}
