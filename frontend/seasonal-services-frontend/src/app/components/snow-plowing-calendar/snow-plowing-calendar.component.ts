import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-snow-plowing-calendar',
  standalone: true,
  templateUrl: './snow-plowing-calendar.component.html',
  styleUrls: ['./snow-plowing-calendar.component.css'],
  imports: [CommonModule, FullCalendarModule],
})
export class SnowPlowingCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    editable: true,
    events: [],
    allDaySlot: false,
  };

  weatherForecast: any[] = [];
  snowForecastExists: boolean = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeatherForecast();
  }

  loadWeatherForecast(): void {
    const lat = 60.8676; // Latitude for Grandview, Alaska
    const lon = -149.8797; // Longitude for Grandview, Alaska

    this.weatherService.getWeatherForecast(lat, lon).subscribe(
      (data) => {
        console.log('API Data:', data); // Log the full API response for verification

        const groupedForecast: { [date: string]: any } = {};

        data.properties.periods.forEach((period: any) => {
          const date = period.startTime.split('T')[0]; // Extract date only
          const temp = period.temperature;
          const tempUnit = period.temperatureUnit; // Extract temperature unit (e.g., °F)
          const isDaytime = period.isDaytime;
          const snowChance = period.probabilityOfPrecipitation?.value || 0;

          // Only care about the chance of snow, skip snowfall amount
          if (snowChance > 0) {
            this.snowForecastExists = true;
          }

          // Group forecasts by day
          if (!groupedForecast[date]) {
            groupedForecast[date] = {
              tempMax: isDaytime ? temp : null,
              tempMin: isDaytime ? null : temp, // Store nighttime temperature as low
              snowChance: snowChance,
              tempUnit: tempUnit,
            };
          } else {
            if (isDaytime) {
              groupedForecast[date].tempMax = Math.max(groupedForecast[date].tempMax ?? temp, temp);
            } else {
              groupedForecast[date].tempMin = Math.min(groupedForecast[date].tempMin ?? temp, temp);
            }
          }
        });

        const forecastEvents = Object.keys(groupedForecast).map((date) => {
          const { tempMax, tempMin, snowChance, tempUnit } = groupedForecast[date];
          const weatherDescription = `High: ${tempMax?.toFixed(1)}${tempUnit}, Low: ${tempMin?.toFixed(1)}${tempUnit}, Chance of Snow: ${(snowChance).toFixed(1)}%`;

          // Add a snowflake if snow is expected
          const title = snowChance > 0 ? `❄️ Forecast: ${weatherDescription}` : `Forecast: ${weatherDescription}`;

          return {
            title: title,
            start: date,
            allDay: true,
            className: snowChance > 0 ? 'snow-day' : '', // Apply CSS class for snow days
          };
        });

        // Update calendar options with forecast events
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...forecastEvents],
        };
      },
      (error) => {
        console.error('Error loading weather data', error);
      }
    );
  }
}
