// snow-plowing-calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
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
    // Removed ChartsModule
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
  // Removed currentWeather and chart-related properties

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
    const today = new Date().toISOString().split('T')[0];
    this.todayDate = today;

    // Process the forecast periods
    const forecastPeriods = data.properties.periods.map((period: any) => {
      return {
        date: new Date(period.startTime).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
        tempMax: period.isDaytime ? period.temperature : null,
        tempMin: !period.isDaytime ? period.temperature : null,
        description: period.shortForecast,
        detailedForecast: period.detailedForecast,
        rawDate: new Date(period.startTime),
      };
    });

    // Merge day and night periods to get high and low temperatures
    const forecastMap: { [date: string]: any } = {};
    forecastPeriods.forEach((period: { date: any; rawDate: any; tempMax: null; description: any; detailedForecast: any; tempMin: null; }) => {
      const dateStr = period.date;
      if (!forecastMap[dateStr]) {
        forecastMap[dateStr] = {
          date: dateStr,
          tempMax: null,
          tempMin: null,
          description: '',
          detailedForecast: '',
          rawDate: period.rawDate,
        };
      }
      if (period.tempMax !== null) {
        forecastMap[dateStr].tempMax = period.tempMax;
        forecastMap[dateStr].description = period.description;
        forecastMap[dateStr].detailedForecast = period.detailedForecast;
      }
      if (period.tempMin !== null) {
        forecastMap[dateStr].tempMin = period.tempMin;
      }
    });

    // Convert the forecastMap back to an array
    this.weatherForecast = Object.values(forecastMap)
      .sort((a: any, b: any) => a.rawDate - b.rawDate)
      .filter(
        (forecast: any) =>
          new Date(forecast.rawDate).getTime() >= new Date(today).getTime()
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
        const timeA = new Date(`1970-01-01T${a.time}`);
        const timeB = new Date(`1970-01-01T${b.time}`);
        return timeA.getTime() - timeB.getTime();
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
