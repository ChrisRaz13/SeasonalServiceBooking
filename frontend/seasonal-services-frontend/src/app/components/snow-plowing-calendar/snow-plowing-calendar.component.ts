// snow-plowing-calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule

@Component({
  selector: 'app-snow-plowing-calendar',
  standalone: true,
  templateUrl: './snow-plowing-calendar.component.html',
  styleUrls: ['./snow-plowing-calendar.component.css'],
  imports: [CommonModule, MatCardModule],
})
export class SnowPlowingCalendarComponent implements OnInit {
  weatherForecast: any[] = [];
  hourlyForecast: any[] = [];
  todayDate: string = '';
  weatherAlerts: any[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeatherForecast();
    this.loadHourlyForecast();
    this.loadWeatherAlerts();
  }

  loadWeatherForecast(): void {
    const lat = 61.2181; // Latitude for Anchorage, Alaska
    const lon = -149.9003; // Longitude for Anchorage, Alaska

    this.weatherService.getWeatherForecast(lat, lon).subscribe(
      (data) => {
        const today = new Date().toISOString().split('T')[0];
        this.todayDate = today;

        // Process the forecast periods
        this.weatherForecast = data.properties.periods.map((period: any) => {
          return {
            date: new Date(period.startTime).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }),
            tempMax: period.isDaytime ? `${period.temperature}°F` : null,
            tempMin: !period.isDaytime ? `${period.temperature}°F` : null,
            description: period.shortForecast,
            detailedForecast: period.detailedForecast,
            rawDate: new Date(period.startTime),
          };
        });

        // Merge day and night periods to get high and low temperatures
        const forecastMap: { [date: string]: any } = {};
        this.weatherForecast.forEach((period) => {
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
          if (period.tempMax) {
            forecastMap[dateStr].tempMax = period.tempMax;
            forecastMap[dateStr].description = period.description;
            forecastMap[dateStr].detailedForecast = period.detailedForecast;
          }
          if (period.tempMin) {
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
      },
      (error) => {
        console.error('Error loading weather data', error);
      }
    );
  }

  loadHourlyForecast(): void {
    const lat = 61.2181;
    const lon = -149.9003;

    this.weatherService.getHourlyForecast(lat, lon).subscribe(
      (data) => {
        const today = new Date().toISOString().split('T')[0];
        this.hourlyForecast = data.properties.periods
          .filter(
            (period: any) =>
              period.startTime.split('T')[0] === today // Only show today's forecast
          )
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
          });
      },
      (error) => {
        console.error('Error loading hourly forecast data', error);
      }
    );
  }

  loadWeatherAlerts(): void {
    const lat = 61.2181; // Latitude for Anchorage, Alaska
    const lon = -149.9003; // Longitude for Anchorage, Alaska

    this.weatherService.getWeatherAlerts(lat, lon).subscribe(
      (data) => {
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
      },
      (error) => {
        console.error('Error loading weather alerts', error);
      }
    );
  }

  // Helper function to get weather icon based on description
  getWeatherIcon(description: string): string {
    description = description.toLowerCase();
    if (description.includes('sunny') || description.includes('clear')) {
      return 'wi-day-sunny';
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

// Helper function to parse ISO 8601 durations
function parseDuration(duration: string): number {
  const regex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/;
  const matches = duration.match(regex);
  if (matches) {
    const days = parseInt(matches[1] || '0', 10);
    const hours = parseInt(matches[2] || '0', 10);
    const minutes = parseInt(matches[3] || '0', 10);

    return (
      days * 24 * 60 * 60 * 1000 +
      hours * 60 * 60 * 1000 +
      minutes * 60 * 1000
    );
  }
  return 0;
}
