import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  // First request to get the forecast URL using latitude and longitude
  getPointData(lat: number, lon: number): Observable<any> {
    const url = `https://api.weather.gov/points/${lat},${lon}`;
    return this.http.get(url);
  }

  // Second request to get the weather forecast
  getWeatherForecast(lat: number, lon: number): Observable<any> {
    return this.getPointData(lat, lon).pipe(
      switchMap((pointData: any) => {
        const forecastUrl = pointData.properties.forecast;
        return this.http.get(forecastUrl);
      })
    );
  }
}
