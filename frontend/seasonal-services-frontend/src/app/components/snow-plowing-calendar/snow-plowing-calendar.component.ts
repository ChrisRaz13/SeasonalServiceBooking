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

        // Extract necessary properties
        const temperatureMax = data.properties.maxTemperature.values;
        const temperatureMin = data.properties.minTemperature.values;
        const snowfallAmount = data.properties.snowfallAmount.values;
        const snowfallUom = data.properties.snowfallAmount.uom;
        const tempMaxUom = data.properties.maxTemperature.uom;
        const tempMinUom = data.properties.minTemperature.uom;
        const weather = data.properties.weather.values;

        // Convert units if necessary
        const convertSnowfallValue = (value: number): number => {
          if (snowfallUom.includes('mm')) {
            return value / 25.4; // Convert mm to inches
          }
          return value; // Assume inches
        };

        const convertTempToFahrenheit = (value: number, uom: string): number => {
          if (uom.includes('degC')) {
            return (value * 9) / 5 + 32; // Convert Celsius to Fahrenheit
          }
          return value; // Assume Fahrenheit
        };

        // Prepare maps for tempMin and weather
        const tempMinMap: { [date: string]: number } = {};
        temperatureMin.forEach((temp: any) => {
          const date = temp.validTime.split('T')[0];
          const tempValue = convertTempToFahrenheit(temp.value, tempMinUom);
          tempMinMap[date] = tempValue;
        });

        const weatherMap: { [date: string]: string } = {};
        weather.forEach((w: any) => {
          const date = w.validTime.split('T')[0];
          const weatherDescription = w.value[0]?.weather;
          if (weatherDescription) {
            weatherMap[date] = weatherDescription;
          }
        });

        // Accumulate snowfall amounts per day
        const snowfallMap: { [date: string]: number } = {};
        snowfallAmount.forEach((snow: any) => {
          const [startTime, duration] = snow.validTime.split('/');
          const startDate = new Date(startTime);
          const durationMs = parseDuration(duration);
          const endDate = new Date(startDate.getTime() + durationMs);

          // Loop through each day in the range
          for (
            let date = new Date(startDate);
            date <= endDate;
            date.setDate(date.getDate() + 1)
          ) {
            const dateString = date.toISOString().split('T')[0];
            const convertedValue = convertSnowfallValue(snow.value);
            snowfallMap[dateString] =
              (snowfallMap[dateString] || 0) + (convertedValue || 0);
          }
        });

        // Assemble forecast data
        const forecastData: any[] = [];

        temperatureMax.forEach((temp: any) => {
          const date = temp.validTime.split('T')[0];
          const tempMaxValue = convertTempToFahrenheit(temp.value, tempMaxUom);
          const tempMinValue = tempMinMap[date];
          const snowfallValue = snowfallMap[date];
          const description = weatherMap[date];

          forecastData.push({
            date: new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }),
            tempMax:
              tempMaxValue !== null ? `${tempMaxValue.toFixed(1)}°F` : 'N/A',
            tempMin:
              tempMinValue !== undefined && tempMinValue !== null
                ? `${tempMinValue.toFixed(1)}°F`
                : 'N/A',
            snowfallAmount:
              snowfallValue !== undefined && snowfallValue !== null && snowfallValue > 0
                ? `${snowfallValue.toFixed(1)} inches`
                : 'No snowfall expected',
            description: description || 'No description',
            rawDate: new Date(date),
          });
        });

        // Sort and filter as needed
        this.weatherForecast = forecastData
          .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
          .filter(
            (forecast) =>
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
