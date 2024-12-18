// src/app/weather/hourly-forecast/hourly-forecast.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartModule } from 'primeng/chart';
import { HourlyForecast, ChartData, ChartOptions } from '../interfaces/weather.interfaces';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, ChartModule],
  templateUrl: './hourly-forecast.component.html',  // Use external HTML template file
  styleUrls: ['./hourly-forecast.component.css']    // Use external CSS
})
export class HourlyForecastComponent implements OnChanges {
  @Input() forecast: HourlyForecast[] = [];
  @Input() chartData!: ChartData;
  @Input() chartOptions!: ChartOptions;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['forecast']) {
      console.log('Updated Hourly Forecast Data:', this.forecast);
    }
  }
}
