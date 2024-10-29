// snow-plowing-calendar.component.ts

import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-snow-plowing-calendar',
  standalone: true,
  templateUrl: './snow-plowing-calendar.component.html',
  styleUrls: ['./snow-plowing-calendar.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatButtonModule,
  ],
})
export class SnowPlowingCalendarComponent implements OnInit {
  weatherForecast: any[] = [];
  hourlyForecast: any[] = [];
  todayDate: string = '';
  weatherAlerts: any[] = [];
  isLoading = true;
  hasError = false;
  isDarkTheme = false;

  constructor(
    private weatherService: WeatherService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadWeatherData();
  }

  loadWeatherData(): void {
    this.isLoading = true;
    this.hasError = false;

    const lat = 61.2181; // Latitude for Anchorage, Alaska
    const lon = -149.9003; // Longitude for Anchorage, Alaska

    forkJoin({
      forecast: this.weatherService.getWeatherForecast(lat, lon),
      hourly: this.weatherService.getHourlyForecast(lat, lon),
      alerts: this.weatherService.getWeatherAlerts(lat, lon),
    }).subscribe(
      (data) => {
        this.processForecastData(data.forecast);
        this.processHourlyData(data.hourly);
        this.processAlertsData(data.alerts);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading weather data', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  processForecastData(data: any): void {
    // Process the forecast periods
    const forecastPeriods = data.properties.periods.map((period: any) => {
      const rawStartDate = new Date(period.startTime);

      // Determine the date for grouping (using the start date)
      const groupingDate = new Date(rawStartDate);
      const dateStr = groupingDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      return {
        date: dateStr,
        rawDate: groupingDate,
        timeOfDay: period.name, // e.g., "Monday", "Monday Night"
        isDaytime: period.isDaytime,
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        windSpeed: period.windSpeed,
        windDirection: period.windDirection,
        shortForecast: period.shortForecast,
        detailedForecast: period.detailedForecast,
        icon: period.icon,
      };
    });

    // Group periods by date using the grouping date
    const forecastMap: { [date: string]: any } = {};
    forecastPeriods.forEach((period: any) => {
      const dateKey = period.rawDate.toDateString(); // Use the grouping date for grouping
      if (!forecastMap[dateKey]) {
        forecastMap[dateKey] = {
          date: period.date,
          rawDate: period.rawDate,
          periods: [],
          tempHigh: null,
          tempLow: null,
        };
      }
      forecastMap[dateKey].periods.push(period);

      // Update tempHigh and tempLow
      if (period.isDaytime) {
        // For daytime, assume it's the high temperature
        forecastMap[dateKey].tempHigh = period.temperature;
      } else {
        // For nighttime, assume it's the low temperature
        forecastMap[dateKey].tempLow = period.temperature;
      }
    });

    // Convert the forecastMap back to an array
    this.weatherForecast = Object.values(forecastMap)
      .sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime())
      .filter(
        (forecast: any) =>
          forecast.rawDate.setHours(0, 0, 0, 0) >=
          new Date().setHours(0, 0, 0, 0)
      );
  }

  processHourlyData(data: any): void {
    const now = new Date();

    // Initialize an empty array to hold the processed hourly data
    const hourlyData: any[] = [];

    let previousDate: string | null = null;

    data.properties.periods
      .filter((period: any) => {
        const periodStartTime = new Date(period.startTime);
        return periodStartTime >= now;
      })
      .forEach((period: any) => {
        const periodDate = new Date(period.startTime);
        const dateStr = periodDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        // If the date changes, add a date separator
        if (dateStr !== previousDate) {
          hourlyData.push({
            isDateSeparator: true,
            date: dateStr,
          });
          previousDate = dateStr;
        }

        // Convert temperature to Fahrenheit if necessary
        let temperature = period.temperature;
        if (period.temperatureUnit === 'C') {
          temperature = (temperature * 9) / 5 + 32;
        }

        hourlyData.push({
          time: periodDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          }),
          temperature: `${temperature.toFixed(1)}°F`,
          windSpeed: period.windSpeed,
          shortForecast: period.shortForecast,
          isDateSeparator: false,
        });
      });

    this.hourlyForecast = hourlyData;
  }

  processAlertsData(data: any): void {
    if (data.features && data.features.length > 0) {
      this.weatherAlerts = data.features.map((feature: any) => {
        const properties = feature.properties;
        return {
          event: properties.event,
          headline: properties.headline,
          description: properties.description,
          instruction: properties.instruction,
          severity: properties.severity,
          effective: properties.effective,
          expires: properties.expires,
          senderName: properties.senderName,
          id: feature.id,
          areaDesc: properties.areaDesc,
        };
      });
    } else {
      this.weatherAlerts = [];
    }
  }

  toggleDarkMode(): void {
    this.isDarkTheme = !this.isDarkTheme;
    const themeClass = this.isDarkTheme ? 'dark-theme' : '';
    this.renderer.setAttribute(document.body, 'class', themeClass);
  }

  // Helper function to get weather icon based on description
  getWeatherIcon(description: string): string {
    description = description.toLowerCase();
    if (description.includes('sunny') || description.includes('clear')) {
      return 'wi-day-sunny';
    } else if (
      description.includes('partly sunny') ||
      description.includes('partly cloudy')
    ) {
      return 'wi-day-cloudy';
    } else if (description.includes('cloudy')) {
      return 'wi-cloudy';
    } else if (description.includes('rain')) {
      return 'wi-rain';
    } else if (description.includes('snow')) {
      return 'wi-snow';
    } else if (description.includes('fog')) {
      return 'wi-fog';
    } else if (description.includes('thunderstorm')) {
      return 'wi-thunderstorm';
    } else {
      return 'wi-day-cloudy';
    }
  }
}
