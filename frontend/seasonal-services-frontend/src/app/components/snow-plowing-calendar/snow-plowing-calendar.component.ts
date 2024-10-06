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
  imports: [CommonModule, FullCalendarModule]
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
    const lat = 41.6611; // Latitude for Iowa City, Iowa
    const lon = -91.5302; // Longitude for Iowa City, Iowa

    this.weatherService.getWeatherForecast(lat, lon).subscribe(
      (data) => {
        console.log('Forecast data:', data); // Debugging: Check API response

        // Extract daily high and low temperatures, along with snow info
        const groupedForecast: { [date: string]: any } = {};

        data.properties.periods.forEach((period: any) => {
          const date = period.startTime.split('T')[0]; // Extract date only
          const tempMax = period.temperature;
          const tempUnit = period.temperatureUnit; // Extract temperature unit (e.g., °F)
          const isDaytime = period.isDaytime;
          const snowChance = period.probabilityOfPrecipitation?.value || 0;
          const snowAmount = period.snowfallAmount?.value || 0; // Extract snowfall amount

          // If any day has a snow chance greater than 0, update snowForecastExists to true
          if (snowChance > 0) {
            this.snowForecastExists = true;
          }

          // Group forecasts by day to determine high and low temperatures
          if (!groupedForecast[date]) {
            groupedForecast[date] = {
              tempMax: isDaytime ? tempMax : null,
              tempMin: isDaytime ? null : tempMax,
              snowChance: snowChance,
              snowAmount: snowAmount,
              tempUnit: tempUnit,
            };
          } else {
            if (isDaytime) {
              groupedForecast[date].tempMax = Math.max(groupedForecast[date].tempMax ?? tempMax, tempMax);
            } else {
              groupedForecast[date].tempMin = Math.min(groupedForecast[date].tempMin ?? tempMax, tempMax);
            }

            groupedForecast[date].snowChance = Math.max(groupedForecast[date].snowChance, snowChance);
            groupedForecast[date].snowAmount += snowAmount; // Accumulate snow amount
          }
        });

        // Create events for each day
        const forecastEvents = Object.keys(groupedForecast).map((date) => {
          const { tempMax, tempMin, snowChance, snowAmount, tempUnit } = groupedForecast[date];
          const weatherDescription = `High: ${tempMax?.toFixed(1)}${tempUnit}, Low: ${tempMin?.toFixed(1)}${tempUnit}, Snow: ${snowAmount.toFixed(1)} mm, Chance of Snow: ${(snowChance).toFixed(1)}%`;

          return {
            title: `Forecast: ${weatherDescription}`,
            start: date,
            allDay: true,
          };
        });

        // Update the calendar options with the forecast events
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
