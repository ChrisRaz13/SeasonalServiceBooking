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
        const gridId = pointData.properties.gridId;
        const gridX = pointData.properties.gridX;
        const gridY = pointData.properties.gridY;
        const gridDataUrl = `https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}`;
        return this.http.get(gridDataUrl, { headers: this.headers });
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
