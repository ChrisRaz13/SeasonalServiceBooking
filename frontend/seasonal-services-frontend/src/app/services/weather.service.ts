import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, forkJoin } from 'rxjs';

// Interfaces for type safety
interface PointData {
  properties: {
    forecast: string;
    forecastHourly: string;
  };
}

interface WeatherResponse {
  properties: {
    periods: Array<{
      startTime: string;
      temperature: number;
      temperatureUnit: string;
      windSpeed: string;
      windDirection: string;
      shortForecast: string;
      detailedForecast: string;
      name: string;
      isDaytime: boolean;
      icon: string;
    }>;
  };
}

interface AlertResponse {
  features: Array<{
    properties: {
      event: string;
      headline: string;
      description: string;
      instruction: string | null;
      severity: string;
      effective: string;
      expires: string;
      senderName: string;
      areaDesc: string;
    };
  }>;
}

interface WeatherData {
  forecast: WeatherResponse;
  hourly: WeatherResponse;
  alerts: AlertResponse;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private headers = new HttpHeaders({
    'User-Agent': 'Alex-Services (alexmgraham07@gmail.com)',
    Accept: 'application/geo+json',
  });

  constructor(private http: HttpClient) {}

  getAllWeatherData(lat: number, lon: number): Observable<WeatherData> {
    return this.getPointData(lat, lon).pipe(
      switchMap((pointData: PointData) => {
        return forkJoin({
          forecast: this.http.get<WeatherResponse>(pointData.properties.forecast, { headers: this.headers }),
          hourly: this.http.get<WeatherResponse>(pointData.properties.forecastHourly, { headers: this.headers }),
          alerts: this.getWeatherAlerts(lat, lon)
        });
      })
    );
  }

  private getPointData(lat: number, lon: number): Observable<PointData> {
    const url = `https://api.weather.gov/points/${lat},${lon}`;
    return this.http.get<PointData>(url, { headers: this.headers });
  }

  getWeatherForecast(lat: number, lon: number): Observable<WeatherResponse> {
    return this.getPointData(lat, lon).pipe(
      switchMap((pointData: PointData) => {
        return this.http.get<WeatherResponse>(pointData.properties.forecast, { headers: this.headers });
      })
    );
  }

  getHourlyForecast(lat: number, lon: number): Observable<WeatherResponse> {
    return this.getPointData(lat, lon).pipe(
      switchMap((pointData: PointData) => {
        return this.http.get<WeatherResponse>(pointData.properties.forecastHourly, { headers: this.headers });
      })
    );
  }

  getWeatherAlerts(lat: number, lon: number): Observable<AlertResponse> {
    const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
    return this.http.get<AlertResponse>(url, { headers: this.headers });
  }

  // Helper method to handle API errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
}
