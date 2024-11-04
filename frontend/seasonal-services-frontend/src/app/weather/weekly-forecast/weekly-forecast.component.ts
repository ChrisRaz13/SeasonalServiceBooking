// src/app/weather/weekly-forecast/weekly-forecast.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DayForecast, WeatherPeriod } from '../interfaces/weather.interfaces.js';
import { DayForecastComponent } from '../day-forecast/day-forecast.component';

@Component({
  selector: 'app-weekly-forecast',
  standalone: true,
  imports: [CommonModule, MatCardModule, DayForecastComponent],
  template: `
    <mat-card class="weekly-forecast">
      <mat-card-header>
        <mat-card-title>7 Day Outlook</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="weekly-timeline">
          <app-day-forecast
            *ngFor="let day of forecast"
            [forecast]="day"
            (toggleDetails)="onToggleDetails($event)">
          </app-day-forecast>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./weekly-forecast.component.css']
})
export class WeeklyForecastComponent {
  @Input() forecast: DayForecast[] = [];
  @Output() toggleDetails = new EventEmitter<WeatherPeriod>();

  onToggleDetails(period: WeatherPeriod): void {
    this.toggleDetails.emit(period);
  }
}
