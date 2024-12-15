import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, forkJoin, throwError, BehaviorSubject } from 'rxjs';
import { switchMap, catchError, retry, map, tap } from 'rxjs/operators';
import {
  WeatherAlert,
  WeatherOutlook,
  HourlyForecast,
  DayForecast,
  WeatherPeriod,
  ServiceStatus,
  WeatherApiResponse,
  AlertSeverity,
  AlertUrgency,
  WeatherUtils,
  ForecastResponse,
  AlertsResponse,
  AlertProperties,
  WeatherComponentProps
} from '../weather/interfaces/weather.interfaces';

interface WeatherCache {
  data: WeatherApiResponse;
  timestamp: number;
}

interface WeatherDataBundle {
  forecast: ForecastResponse;
  hourly: ForecastResponse;
  alerts: AlertsResponse;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly API_BASE = 'https://api.weather.gov';
  private readonly RETRY_ATTEMPTS = 3;
  private readonly CACHE_DURATION = 300000; // 5 minutes
  private readonly DEFAULT_COORDINATES = { lat: 41.6611, lon: -91.5302 }; // Iowa City

  private cache: { [key: string]: WeatherCache } = {};
  private alertsSubject = new BehaviorSubject<WeatherAlert[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  private headers = new HttpHeaders({
    'User-Agent': '(alex-services.com, contact@alex-services.com)',
    'Accept': 'application/geo+json'
  });

  constructor(private http: HttpClient) {
    this.startPeriodicUpdates();
  }

  getAllWeatherData(
    lat: number = this.DEFAULT_COORDINATES.lat,
    lon: number = this.DEFAULT_COORDINATES.lon
  ): Observable<WeatherApiResponse> {
    const cacheKey = `weather_${lat}_${lon}`;
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.alertsSubject.next(cachedData.alerts || []);
      return of(cachedData);
    }

    return this.getPointData(lat, lon).pipe(
      switchMap(pointData => {
        const requests = {
          forecast: this.http.get<ForecastResponse>(pointData.properties.forecast, { headers: this.headers }),
          hourly: this.http.get<ForecastResponse>(pointData.properties.forecastHourly, { headers: this.headers }),
          alerts: this.getWeatherAlerts(lat, lon, pointData.properties.gridId)
        };

        return forkJoin(requests).pipe(
          retry(this.RETRY_ATTEMPTS),
          map((data: WeatherDataBundle) => this.processWeatherData(data)),
          tap(processedData => {
            this.setCache(cacheKey, processedData);
            this.alertsSubject.next(processedData.alerts || []);
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return of(this.getEmptyWeatherData());
      })
    );
  }

  public getPointData(lat: number, lon: number): Observable<any> {
    const url = `${this.API_BASE}/points/${lat},${lon}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  public getWeatherAlerts(lat: number, lon: number, gridId: string): Observable<AlertsResponse> {
    const zoneUrl = `${this.API_BASE}/alerts/active/zone/${gridId}`;
    return this.http.get<AlertsResponse>(zoneUrl, { headers: this.headers }).pipe(
      catchError(() => {
        const areaUrl = `${this.API_BASE}/alerts/active?point=${lat},${lon}`;
        return this.http.get<AlertsResponse>(areaUrl, { headers: this.headers });
      }),
      retry(this.RETRY_ATTEMPTS),
      catchError(() => of({ features: [] }))
    );
  }

  private processWeatherData(data: WeatherDataBundle): WeatherApiResponse {
    return {
      forecast: this.processForecastData(data.forecast),
      hourly: this.processHourlyData(data.hourly),
      alerts: this.processAlerts(data.alerts)
    };
  }

  private processForecastData(forecast: ForecastResponse): DayForecast[] {
    if (!forecast?.properties?.periods) return [];

    const dailyForecasts: DayForecast[] = [];
    const periods = forecast.properties.periods;

    for (let i = 0; i < periods.length; i += 2) {
      const dayPeriod = periods[i];
      const nightPeriod = periods[i + 1];

      if (dayPeriod) {
        const dayForecast: DayForecast = {
          date: dayPeriod.startTime,
          dayOfWeek: new Date(dayPeriod.startTime)
            .toLocaleDateString('en-US', { weekday: 'short' }),
          highTemp: dayPeriod.temperature,
          lowTemp: nightPeriod ? nightPeriod.temperature : null,
          dayPeriod: this.createWeatherPeriod(dayPeriod),
          nightPeriod: nightPeriod ? this.createWeatherPeriod(nightPeriod) : undefined
        };
        dailyForecasts.push(dayForecast);
      }
    }

    return dailyForecasts;
  }

  private processHourlyData(hourly: ForecastResponse): HourlyForecast[] {
    if (!hourly?.properties?.periods) return [];

    return hourly.properties.periods.map(period => ({
      time: new Date(period.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric', hour12: true
      }),
      temperature: period.temperature,
      temperatureUnit: period.temperatureUnit,
      snowProbability: WeatherUtils.calculateSnowProbability(period.shortForecast),
      accumulation: WeatherUtils.extractSnowAccumulation(period.detailedForecast),
      windSpeed: WeatherUtils.extractWindSpeed(period.windSpeed),
      windDirection: period.windDirection,
      shortForecast: period.shortForecast,
      isDaytime: period.isDaytime
    }));
  }

  private processAlerts(alertResponse: AlertsResponse): WeatherAlert[] {
    if (!alertResponse?.features) return [];

    const alerts = alertResponse.features
      .filter(feature => this.isRelevantAlert(feature))
      .map(feature => this.createWeatherAlert(feature.properties));

    return this.sortAlertsByPriority(alerts);
  }

  private createWeatherAlert(properties: AlertProperties): WeatherAlert {
    return {
      severity: properties.severity as AlertSeverity,
      urgency: properties.urgency as AlertUrgency,
      event: properties.event,
      headline: properties.headline,
      description: properties.description,
      instruction: properties.instruction,
      expires: properties.expires,
      onset: properties.onset,
      status: properties.status,
      messageType: properties.messageType,
      category: properties.category,
      areaDesc: properties.areaDesc,
      certainty: properties.certainty,
      response: properties.response,
      outlook: properties.event === 'Hazardous Weather Outlook'
        ? WeatherUtils.parseWeatherOutlook(properties.description)
        : undefined
    };
  }

  private createWeatherPeriod(period: any): WeatherPeriod {
    return {
      temperature: period.temperature,
      temperatureUnit: period.temperatureUnit,
      windSpeed: period.windSpeed,
      windDirection: period.windDirection,
      shortForecast: period.shortForecast,
      detailedForecast: period.detailedForecast,
      snowProbability: WeatherUtils.calculateSnowProbability(period.shortForecast),
      snowAmount: WeatherUtils.extractSnowAccumulation(period.detailedForecast),
      showDetails: false,
      timeOfDay: period.name,
      isDaytime: period.isDaytime,
      startTime: period.startTime,
      endTime: period.endTime,
      icon: period.icon
    };
  }

  private sortAlertsByPriority(alerts: WeatherAlert[]): WeatherAlert[] {
    return alerts.sort((a, b) => {

      if (a.severity !== b.severity) {
        return this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity);
      }

      const urgencyA = a.urgency ?? AlertUrgency.UNKNOWN;
      const urgencyB = b.urgency ?? AlertUrgency.UNKNOWN;
      if (urgencyA !== urgencyB) {
        return this.getUrgencyWeight(urgencyB) - this.getUrgencyWeight(urgencyA);
      }

      return new Date(a.expires).getTime() - new Date(b.expires).getTime();
    });
  }

  private getSeverityWeight(severity: AlertSeverity): number {
    const weights = {
      [AlertSeverity.EXTREME]: 4,
      [AlertSeverity.SEVERE]: 3,
      [AlertSeverity.MODERATE]: 2,
      [AlertSeverity.MINOR]: 1
    };
    return weights[severity] || 0;
  }

  private getUrgencyWeight(urgency: AlertUrgency): number {
    const weights = {
      [AlertUrgency.IMMEDIATE]: 4,
      [AlertUrgency.EXPECTED]: 3,
      [AlertUrgency.FUTURE]: 2,
      [AlertUrgency.PAST]: 1,
      [AlertUrgency.UNKNOWN]: 0
    };
    return weights[urgency] || 0;
  }

  private isRelevantAlert(feature: any): boolean {
    const props = feature.properties;
    return (
      props.messageType !== 'Test' &&
      props.status !== 'Test' &&
      props.category !== 'Cancel' &&
      (this.isHazardousWeather(props.event) ||
        this.isHighSeverity(props.severity as AlertSeverity))
    );
  }

  private isHazardousWeather(event: string): boolean {
    const hazardousEvents = [
      'Winter Storm', 'Snow', 'Ice', 'Blizzard', 'Winter Weather',
      'Frost', 'Freeze', 'Wind Chill', 'Heavy Snow', 'Winter Storm Watch',
      'Winter Storm Warning', 'Hazardous Weather Outlook'
    ];
    return hazardousEvents.some(hazard =>
      event.toLowerCase().includes(hazard.toLowerCase())
    );
  }

  private isHighSeverity(severity: AlertSeverity): boolean {
    return [AlertSeverity.EXTREME, AlertSeverity.SEVERE].includes(severity);
  }

  getServiceStatus(accumulation: number): ServiceStatus {
    if (accumulation >= 2) return ServiceStatus.REQUIRED;
    if (accumulation >= 1) return ServiceStatus.MONITORING;
    return ServiceStatus.NOT_NEEDED;
  }

  getCurrentConditions(hourlyData: HourlyForecast[]): WeatherComponentProps {
    if (!hourlyData.length) return {};

    const current = hourlyData[0];
    return {
      currentConditions: {
        temperature: current.temperature,
        temperatureUnit: current.temperatureUnit,
        windSpeed: `${current.windSpeed} mph`,
        windDirection: current.windDirection || '',
        shortForecast: current.shortForecast,
        detailedForecast: '',
        snowProbability: current.snowProbability,
        snowAmount: current.accumulation,
        showDetails: false,
        timeOfDay: current.isDaytime ? 'Day' : 'Night',
        isDaytime: current.isDaytime
      },
      serviceStatus: this.getServiceStatus(current.accumulation)
    };
  }

  getTotalAccumulation(forecast: HourlyForecast[]): number {
    return forecast.reduce((total, hour) => total + hour.accumulation, 0);
  }

  getMaxSnowProbability(forecast: HourlyForecast[]): number {
    return Math.max(...forecast.map(hour => hour.snowProbability));
  }

  private getFromCache(key: string): WeatherApiResponse | null {
    const cached = this.cache[key];
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: WeatherApiResponse): void {
    this.cache[key] = {
      data,
      timestamp: Date.now()
    };
  }

  private clearCache(): void {
    this.cache = {};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.status === 404) {
        errorMessage = 'Weather data not found for this location';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.status >= 500) {
        errorMessage = 'Weather service is currently unavailable';
      }
    }

    console.error('Weather API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getEmptyWeatherData(): WeatherApiResponse {
    return {
      forecast: [],
      hourly: [],
      alerts: []
    };
  }

  private startPeriodicUpdates(): void {
    setInterval(() => {
      this.getAllWeatherData().subscribe({
        error: (error) => {
          console.error('Error in periodic update:', error);
        }
      });
    }, this.CACHE_DURATION);
  }

  forceUpdate(): Observable<WeatherApiResponse> {
    this.clearCache();
    return this.getAllWeatherData();
  }

  stopUpdates(): void {
    // Implement if you need to stop periodic updates
  }

  formatTemperature(temp: number, unit: string = 'F'): string {
    return `${temp}°${unit}`;
  }

  getWindDescription(speed: number, direction: string): string {
    return `${speed} mph ${direction}`;
  }

  shouldShowSnowAlert(probability: number, accumulation: number): boolean {
    return probability > 50 || accumulation > 1;
  }
}
