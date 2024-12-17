import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  WeatherPeriod,
  DayForecast
} from '../interfaces/weather.interfaces';

@Component({
  selector: 'app-weekly-forecast',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './weekly-forecast.component.html',
  styleUrls: ['./weekly-forecast.component.css']
})
export class WeeklyForecastComponent {
  @Input() forecast: DayForecast[] = [];
  @Output() toggleDetails = new EventEmitter<WeatherPeriod>();

  formatDate(dateString: string, format: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: format === 'EEE' ? 'short' : undefined,
      month: format === 'MMM d' ? 'short' : undefined,
      day: format === 'MMM d' ? 'numeric' : undefined
    };
    return date.toLocaleDateString('en-US', options);
  }

  getWeatherEmoji(forecast: string): string {
    const lowercaseForecast = forecast.toLowerCase();
    if (lowercaseForecast.includes('snow')) return '❄️';
    if (lowercaseForecast.includes('rain')) return '🌧️';
    if (lowercaseForecast.includes('cloud')) return '☁️';
    if (lowercaseForecast.includes('sun') || lowercaseForecast.includes('clear')) return '☀️';
    if (lowercaseForecast.includes('fog')) return '🌫️';
    if (lowercaseForecast.includes('thunder')) return '⛈️';
    return '🌤️';
  }

  hasSnowInfo(period: WeatherPeriod): boolean {
    return period.snowProbability > 0 || period.snowAmount > 0;
  }

  onToggleDetails(period: WeatherPeriod): void {
    this.toggleDetails.emit(period);
  }
}
