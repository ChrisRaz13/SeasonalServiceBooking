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

  ServiceStatus = ServiceStatus;

  formatPeriodHeader(period: WeatherPeriod): string {
    return this.isToday
      ? period.isDaytime ? 'Today' : 'Tonight'
      : period.isDaytime ? this.forecast.dayOfWeek : `${this.forecast.dayOfWeek} Night`;
  }

  getPrecipitationDetails(period: WeatherPeriod): string {
    if (period.snowProbability > 0) {
        return this.getSnowDetails(period);
    }

    // Instead of checking period.precipitation, we'll check the forecast text
    const forecast = period.detailedForecast.toLowerCase();
    if (forecast.includes('rain')) {
        const chance = this.extractPrecipitationChance(period.detailedForecast);
        if (chance > 0) {
            return `${chance}% chance of rain`;
        }
    }
    return '';
}

private extractPrecipitationChance(forecast: string): number {
    const match = forecast.match(/(\d+)\s*%\s*chance/i);
    return match ? parseInt(match[1]) : 0;
}

private getSnowDetails(period: WeatherPeriod): string {
    const details = [`${period.snowProbability}% chance of snow`];
    if (period.snowAmount > 0) {
        details.push(`${period.snowAmount}" accumulation expected`);
    }
    return details.join(' - ');
}

  getServiceStatus(period: WeatherPeriod): ServiceStatus {
    if (period.snowAmount >= 2) return ServiceStatus.REQUIRED;
    if (period.snowProbability > 30 || period.snowAmount >= 1) return ServiceStatus.MONITORING;
    return ServiceStatus.NOT_NEEDED;
  }

  getWindDescription(speed: string, direction: string): string {
    const windSpeed = WeatherUtils.extractWindSpeed(speed);
    return windSpeed === 0 ? 'Calm' : `${direction} ${speed}`;
  }

  shouldHighlightWind(speed: string): boolean {
    return WeatherUtils.extractWindSpeed(speed) > 15;
  }

  getStatusColor(status: ServiceStatus): string {
    const statusColors = {
      [ServiceStatus.REQUIRED]: 'service-required',
      [ServiceStatus.MONITORING]: 'service-monitoring',
      [ServiceStatus.NOT_NEEDED]: ''
    };
    return statusColors[status];
  }

  formatTemperature(temp: number): string {
    return `${Math.round(temp)}°`;
  }

  getWeatherIcon(forecast: string): string {
    const lowercaseForecast = forecast.toLowerCase();
    const iconMap: { [key: string]: string } = {
      snow: 'ac_unit',
      rain: 'water_drop',
      cloud: 'cloud',
      sun: 'wb_sunny',
      clear: 'wb_sunny',
      wind: 'air',
      gust: 'air',
      fog: 'cloud',
      thunder: 'thunderstorm'
    };

    for (const [condition, icon] of Object.entries(iconMap)) {
      if (lowercaseForecast.includes(condition)) {
        return icon;
      }
    }
    return 'wb_sunny';
  }

  isHighImpactWeather(period: WeatherPeriod): boolean {
    return period.snowProbability > 50 ||
           WeatherUtils.extractWindSpeed(period.windSpeed) > 20 ||
           period.snowAmount >= 2;
  }
}
