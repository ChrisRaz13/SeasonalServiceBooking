// snow-plowing-calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
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
    MatExpansionModule
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

  constructor(private weatherService: WeatherService) {}

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
    const today = new Date().setHours(0, 0, 0, 0);

    // Process the forecast periods
    const forecastPeriods = data.properties.periods.map((period: any) => {
      const rawDate = new Date(period.startTime);
      return {
        date: rawDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
        rawDate: rawDate,
        timeOfDay: period.isDaytime ? 'Day' : 'Night',
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        windSpeed: period.windSpeed,
        windDirection: period.windDirection,
        shortForecast: period.shortForecast,
        detailedForecast: period.detailedForecast,
        icon: period.icon,
      };
    });

    // Group periods by date using the raw date
    const forecastMap: { [date: string]: any } = {};
    forecastPeriods.forEach((period: any) => {
      const dateKey = period.rawDate.toDateString(); // Use the raw date for grouping
      if (!forecastMap[dateKey]) {
        forecastMap[dateKey] = {
          date: period.date,
          rawDate: period.rawDate,
          periods: [],
        };
      }
      forecastMap[dateKey].periods.push(period);
    });

    // Convert the forecastMap back to an array
    this.weatherForecast = Object.values(forecastMap)
      .filter(
        (forecast: any) =>
          forecast.rawDate.setHours(0, 0, 0, 0) >= today
      )
      .sort(
        (a: any, b: any) =>
          a.rawDate.getTime() - b.rawDate.getTime()
      );
  }


  processHourlyData(data: any): void {
    const now = new Date();

    this.hourlyForecast = data.properties.periods
      .filter((period: any) => {
        const periodStartTime = new Date(period.startTime);
        return periodStartTime >= now;
      })
      .map((period: any) => {
        // Convert temperature to Fahrenheit if necessary
        let temperature = period.temperature;
        if (period.temperatureUnit === 'C') {
          temperature = (temperature * 9) / 5 + 32;
        }
        return {
          time: new Date(period.startTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          }),
          temperature: `${temperature.toFixed(1)}°F`,
          windSpeed: period.windSpeed,
          shortForecast: period.shortForecast,
        };
      })
      .sort((a: any, b: any) => {
        // Ensure the periods are sorted in chronological order
        const timeA = new Date(`1970-01-01T${a.time}`).getTime();
        const timeB = new Date(`1970-01-01T${b.time}`).getTime();
        return timeA - timeB;
      });
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
    const themeClass = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    document.body.className = themeClass;
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
