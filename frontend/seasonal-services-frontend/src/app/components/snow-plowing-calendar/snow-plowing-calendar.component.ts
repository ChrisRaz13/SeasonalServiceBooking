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

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeatherForecast();
  }

  loadWeatherForecast(): void {
    const lat = 41.6611; // Latitude for Iowa City, Iowa
    const lon = -91.5302; // Longitude for Iowa City, Iowa

    this.weatherService.getForecastForLocation(lat, lon).subscribe(
      (data: any) => {
        console.log('Forecast data:', data); // Debugging: Check API response

        // Extract forecast periods
        const forecastPeriods = data.properties.periods;

        // Create events for each day
        const forecastEvents = forecastPeriods.map((forecast: any) => {
          const date = forecast.startTime.split('T')[0]; // Extract date part
          const temperature = `${forecast.temperature}°F`;
          const weatherDescription = forecast.shortForecast.toLowerCase(); // Convert to lowercase for easier matching
          const chanceOfPrecipitation = forecast.probabilityOfPrecipitation?.value || 0;

          // Check if snow is mentioned
          let snowInfo = '';
          if (weatherDescription.includes('snow')) {
            snowInfo = `, Snow Expected`;
            if (chanceOfPrecipitation > 0) {
              snowInfo += ` (${chanceOfPrecipitation}% chance)`;
            }
          }

          return {
            title: `Forecast: ${temperature}, ${forecast.shortForecast}${snowInfo}`,
            start: date,
            allDay: true,
            classNames: weatherDescription.includes('snow') ? ['fc-event-snow'] : [] // Add a specific class for snow events
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
