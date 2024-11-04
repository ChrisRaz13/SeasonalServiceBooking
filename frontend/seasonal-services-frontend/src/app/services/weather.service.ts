import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { switchMap, catchError, retry, map } from 'rxjs/operators';

interface PointData {
  properties: {
    forecast: string;
    forecastHourly: string;
    gridId: string;
    gridX: number;
    gridY: number;
  };
}

interface ProcessedWeatherData {
  forecast: WeatherResponse | null;
  hourly: WeatherResponse | null;
  alerts: AlertSummary[];
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

interface AlertFeature {
  properties: {
    event: string;
    headline: string;
    description: string;
    instruction: string | null;
    severity: string;
    certainty: string;
    urgency: string;
    effective: string;
    expires: string;
    senderName: string;
    areaDesc: string;
    messageType: string;
    category: string;
    response: string;
    status: string;
  };
}

interface AlertResponse {
  features: AlertFeature[];
  title: string;
  updated: string;
}

interface AlertSummary {
  event: string;
  severity: string;
  headline: string;
  description: string;
  instruction: string | null;
  expires: string;
  effective: string;
  urgency: string;
  certainty: string;
  areaDesc: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly headers = new HttpHeaders({
    'User-Agent': 'YourApp (your_email@example.com)',
    Accept: 'application/geo+json',
  });

  private readonly API_BASE = 'https://api.weather.gov';
  private readonly RETRY_ATTEMPTS = 3;
  private readonly CACHE_DURATION = 300000; // 5 minutes
  private cache: { [key: string]: { data: any; timestamp: number } } = {};

  constructor(private http: HttpClient) {}

  getAllWeatherData(lat: number, lon: number): Observable<ProcessedWeatherData> {
    const cacheKey = `weather_${lat}_${lon}`;
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      console.log('Returning cached weather data:', cachedData);
      return of(cachedData);
    }

    return this.getPointData(lat, lon).pipe(
      switchMap((pointData: PointData) => {
        return forkJoin({
          forecast: this.http.get<WeatherResponse>(pointData.properties.forecast, { headers: this.headers }),
          hourly: this.http.get<WeatherResponse>(pointData.properties.forecastHourly, { headers: this.headers }),
          alerts: this.getWeatherAlerts(lat, lon),
        }).pipe(
          retry(this.RETRY_ATTEMPTS),
          map(data => {
            const processed: ProcessedWeatherData = {
              forecast: data.forecast,
              hourly: data.hourly,
              alerts: this.processAlerts(data.alerts) // Process AlertResponse to AlertSummary[]
            };
            this.setCache(cacheKey, processed);
            return processed;
          }),
          catchError(error => {
            console.error('Error fetching weather data:', error);
            return of({ forecast: null, hourly: null, alerts: [] });
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching point data:', error);
        return of({ forecast: null, hourly: null, alerts: [] });
      })
    );
  }

  private getPointData(lat: number, lon: number): Observable<PointData> {
    const url = `${this.API_BASE}/points/${lat},${lon}`;
    return this.http.get<PointData>(url, { headers: this.headers }).pipe(
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  getWeatherAlerts(lat: number, lon: number): Observable<AlertResponse> {
    return this.getPointData(lat, lon).pipe(
      switchMap((pointData: PointData) => {
        const zoneUrl = `${this.API_BASE}/alerts/active/zone/${pointData.properties.gridId}`;
        return this.http.get<AlertResponse>(zoneUrl, { headers: this.headers }).pipe(
          catchError(() => {
            const areaUrl = `${this.API_BASE}/alerts/active?point=${lat},${lon}`;
            return this.http.get<AlertResponse>(areaUrl, { headers: this.headers });
          })
        );
      }),
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  processAlerts(alerts: AlertResponse): AlertSummary[] {
    if (!alerts.features || alerts.features.length === 0) {
      return [];
    }

    return alerts.features
      .filter(feature => this.isRelevantAlert(feature))
      .map(feature => ({
        event: feature.properties.event,
        severity: feature.properties.severity,
        headline: feature.properties.headline,
        description: feature.properties.description,
        instruction: feature.properties.instruction,
        expires: feature.properties.expires,
        effective: feature.properties.effective,
        urgency: feature.properties.urgency,
        certainty: feature.properties.certainty,
        areaDesc: feature.properties.areaDesc,
        status: feature.properties.status,
      }))
      .sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity));
  }

  private isRelevantAlert(feature: AlertFeature): boolean {
    return feature.properties.messageType !== 'Test' &&
           feature.properties.status !== 'Test' &&
           feature.properties.category !== 'Cancel' &&
           (this.isHazardousWeather(feature.properties.event) ||
            this.isHighSeverity(feature.properties.severity));
  }

  private isHazardousWeather(event: string): boolean {
    const hazardousEvents = [
      'Winter Storm', 'Snow', 'Ice', 'Blizzard', 'Hazardous Weather', 'Winter Weather', 'Frost',
      'Freeze', 'Wind Chill', 'Heavy Snow', 'Winter Storm Watch', 'Winter Storm Warning'
    ];
    return hazardousEvents.some(hazard => event.toLowerCase().includes(hazard.toLowerCase()));
  }

  private isHighSeverity(severity: string): boolean {
    return ['Extreme', 'Severe'].includes(severity);
  }

  private getSeverityWeight(severity: string): number {
    const weights: { [key: string]: number } = {
      'Extreme': 4,
      'Severe': 3,
      'Moderate': 2,
      'Minor': 1,
      'Unknown': 0
    };
    return weights[severity] || 0;
  }

  private getFromCache(key: string): any {
    const cached = this.cache[key];
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache[key] = { data, timestamp: Date.now() };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
