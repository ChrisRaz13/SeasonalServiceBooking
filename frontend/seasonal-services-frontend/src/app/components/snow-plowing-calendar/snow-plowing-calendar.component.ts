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
  };

  weatherForecast: any[] = []; // To store weather forecast details

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeatherForecast(); // Call the correct method to load the weather forecast
  }

  loadWeatherForecast(): void {
    const lat = 41.6611; // Latitude for Iowa City, Iowa
    const lon = -91.5302; // Longitude for Iowa City, Iowa

    this.weatherService.getWeatherForecast(lat, lon).subscribe(
      (data) => {
        console.log('Forecast data:', data); // Debugging: Check API response

        // Create events for each day in the forecast
        const forecastEvents = data.list.map((forecast: any) => {
          const date = forecast.dt_txt.split(' ')[0];
          const weatherDescription = forecast.weather[0]?.description || 'Weather Update';
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
