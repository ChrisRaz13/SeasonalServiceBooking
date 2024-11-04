// src/app/weather/day-forecast/day-forecast.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DayForecast, WeatherPeriod } from '../interfaces/weather.interfaces.js';

@Component({
  selector: 'app-day-forecast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="day-forecast">
      <div class="day-header">
        <div class="date-info">
          <span class="day-name">{{forecast.dayOfWeek}}</span>
          <span class="date">{{formatShortDate(forecast.date)}}</span>
        </div>
        <div class="temp-range">
          <span class="high">{{forecast.highTemp}}°</span>
          <span class="separator">/</span>
          <span class="low" *ngIf="forecast.lowTemp">{{forecast.lowTemp}}°</span>
        </div>
      </div>

      <div class="periods-container">
        <!-- Day Period -->
        <ng-container *ngTemplateOutlet="periodTemplate;
          context: { period: forecast.dayPeriod, isDay: true }">
        </ng-container>

        <!-- Night Period -->
        <ng-container *ngIf="forecast.nightPeriod">
          <ng-container *ngTemplateOutlet="periodTemplate;
            context: { period: forecast.nightPeriod, isDay: false }">
          </ng-container>
        </ng-container>
      </div>
    </div>

    <ng-template #periodTemplate let-period="period" let-isDay="isDay">
      <div class="period-card" [class.day-period]="isDay" [class.night-period]="!isDay"
           [class.snow-expected]="period.snowProbability > 30">
        <div class="period-header">
          <div class="period-icon">
            <mat-icon>{{isDay ? 'wb_sunny' : 'nightlight'}}</mat-icon>
            <span class="period-label">{{isDay ? 'Day' : 'Night'}}</span>
          </div>
          <div class="period-temp">{{period.temperature}}°</div>
        </div>

        <div class="period-details">
          <div class="weather-icon-large">
            <mat-icon>{{getWeatherIcon(period.shortForecast)}}</mat-icon>
          </div>
          <div class="weather-description">
            <p class="primary-condition">{{period.shortForecast}}</p>
            <div class="condition-details">
              <div class="wind-info">
                <mat-icon>air</mat-icon>
                {{period.windSpeed}} {{period.windDirection}}
              </div>
              <div class="precip-info" *ngIf="period.snowProbability > 0">
                <mat-icon>ac_unit</mat-icon>
                <span>{{period.snowProbability}}% chance</span>
                <span *ngIf="period.snowAmount > 0" class="snow-amount">
                  ({{period.snowAmount}}")
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="detailed-forecast" [class.expanded]="period.showDetails">
          <p>{{period.detailedForecast}}</p>
          <button mat-button color="primary" (click)="onToggleDetails(period)">
            {{period.showDetails ? 'Show Less' : 'Show More'}}
          </button>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./day-forecast.component.css']
})
export class DayForecastComponent {
  @Input() forecast!: DayForecast;
  @Output() toggleDetails = new EventEmitter<WeatherPeriod>();

  formatShortDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
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

  onToggleDetails(period: WeatherPeriod): void {
    this.toggleDetails.emit(period);
  }
}
