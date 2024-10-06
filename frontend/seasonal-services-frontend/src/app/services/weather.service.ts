import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  // Get the metadata to obtain the forecast URL
  getForecastForLocation(lat: number, lon: number): Observable<any> {
    const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;

    const headers = new HttpHeaders({
      'User-Agent': 'MyWeatherApp (example@example.com)'
    });

    return this.http.get(pointsUrl, { headers }).pipe(
      switchMap((pointsResponse: any) => {
        const forecastUrl = pointsResponse.properties.forecast;
        return this.http.get(forecastUrl, { headers });
      })
    );
  }
}
