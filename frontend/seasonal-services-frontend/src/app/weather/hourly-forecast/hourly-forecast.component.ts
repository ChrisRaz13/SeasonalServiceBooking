// src/app/weather/hourly-forecast/hourly-forecast.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartModule } from 'primeng/chart';
import { HourlyForecast, ChartData, ChartOptions } from '../interfaces/weather.interfaces.js';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, ChartModule],
  template: `
    <mat-card class="hourly-forecast">
      <mat-card-header>
        <mat-card-title>Next 24 Hours</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="chart-container">
          <p-chart type="line"
                  [data]="chartData"
                  [options]="chartOptions"
                  height="300px">
          </p-chart>
        </div>

        <div class="hourly-timeline">
          <div *ngFor="let hour of forecast" class="hour-card"
               [class.snow-likely]="hour.snowProbability > 50">
            <div class="hour-time">{{hour.time}}</div>
            <div class="hour-temp">{{hour.temperature}}°F</div>
            <div class="snow-chance">
              <mat-icon [class.active]="hour.snowProbability > 50">ac_unit</mat-icon>
              {{hour.snowProbability}}%
            </div>
            <div class="accumulation" *ngIf="hour.accumulation > 0">
              +{{hour.accumulation}}"
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./hourly-forecast.component.css']
})
export class HourlyForecastComponent {
  @Input() forecast: HourlyForecast[] = [];
  @Input() chartData!: ChartData;
  @Input() chartOptions!: ChartOptions;
}
