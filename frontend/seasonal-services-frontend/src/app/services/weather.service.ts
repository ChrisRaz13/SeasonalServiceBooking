// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private headers = new HttpHeaders({
    'User-Agent': 'YourAppName (your-email@example.com)', // Replace with your app name and email
    Accept: 'application/geo+json',
  });

  constructor(private http: HttpClient) {}

  getPointData(lat: number, lon: number): Observable<any> {
    const url = `https://api.weather.gov/points/${lat},${lon}`;
    return this.http.get(url, { headers: this.headers });
  }

  getWeatherForecast(lat: number, lon: number): Observable<any> {
    return this.getPointData(lat, lon).pipe(
      switchMap((pointData: any) => {
        const forecastUrl = pointData.properties.forecast; // Use the 'forecast' URL
        return this.http.get(forecastUrl, { headers: this.headers });
      })
    );
  }

  getHourlyForecast(lat: number, lon: number): Observable<any> {
    return this.getPointData(lat, lon).pipe(
      switchMap((pointData: any) => {
        const hourlyForecastUrl = pointData.properties.forecastHourly;
        return this.http.get(hourlyForecastUrl, { headers: this.headers });
      })
    );
  }

  getWeatherAlerts(lat: number, lon: number): Observable<any> {
    const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
    return this.http.get(url, { headers: this.headers });
  }
}
