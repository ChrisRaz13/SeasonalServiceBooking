export interface WeatherAlert {
  id?: string;
  severity: AlertSeverity;
  event: string;
  headline: string;
  description: string;
  instruction?: string | null;
  expires: string;
  onset?: string;
  status?: string;
  messageType?: string;
  category?: string;
  urgency?: AlertUrgency;
  certainty?: string;
  areaDesc?: string;
  response?: string;
  outlook?: WeatherOutlook;
}

export interface WeatherOutlook {
  issuedBy: string;
  issuedAt: string;
  regions: string[];
  dayOne: string;
  extendedOutlook: string;
  spotterInfo: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  temperatureUnit: string;
  snowProbability: number;
  accumulation: number;
  windSpeed: number;
  windDirection?: string;
  shortForecast: string;
  precipitation?: number;
  relativeHumidity?: number;
  isDaytime: boolean;
}

export interface WeatherPeriod {
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
  snowProbability: number;
  snowAmount: number;
  showDetails: boolean;
  timeOfDay: string;
  isDaytime: boolean;
  icon?: string;
  startTime?: string;
  endTime?: string;
  name?: string;
}

export interface DayForecast {
  date: string;
  dayOfWeek: string;
  highTemp: number;
  lowTemp: number | null;
  dayPeriod: WeatherPeriod;
  nightPeriod?: WeatherPeriod;
  precipitation?: number;
  snowChance?: number;
}

/**
 * After processing, we're returning arrays of processed data rather than raw responses.
 */
export interface WeatherApiResponse {
  alerts?: WeatherAlert[];
  hourly?: HourlyForecast[];
  forecast?: DayForecast[];
}

/**
 * Raw API Responses
 */
export interface AlertsResponse {
  features: Array<{
    properties: AlertProperties;
  }>;
  title?: string;
  updated?: string;
}

export interface AlertProperties {
  severity: AlertSeverity;
  event: string;
  headline: string;
  description: string;
  instruction: string | null;
  expires: string;
  onset?: string;
  status?: string;
  messageType?: string;
  category?: string;
  urgency?: AlertUrgency;
  certainty?: string;
  areaDesc?: string;
  response?: string;
}

export interface ForecastResponse {
  properties: {
    periods: Array<ForecastPeriod>;
  };
}

export interface ForecastPeriod {
  startTime: string;
  endTime: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
  isDaytime: boolean;
  name: string;
  icon?: string;
}

export enum AlertSeverity {
  EXTREME = 'extreme',
  SEVERE = 'severe',
  MODERATE = 'moderate',
  MINOR = 'minor'
}

export enum AlertUrgency {
  IMMEDIATE = 'Immediate',
  EXPECTED = 'Expected',
  FUTURE = 'Future',
  PAST = 'Past',
  UNKNOWN = 'Unknown'
}

export enum WeatherCondition {
  SNOW = 'SNOW',
  RAIN = 'RAIN',
  CLEAR = 'CLEAR',
  CLOUDY = 'CLOUDY',
  WINDY = 'WINDY',
  THUNDERSTORM = 'THUNDERSTORM'
}

export enum ServiceStatus {
  REQUIRED = 'Service Required',
  MONITORING = 'Monitor Conditions',
  NOT_NEEDED = 'No Service Needed'
}

export class WeatherUtils {
  static calculateSnowProbability(shortForecast: string): number {
    const forecast = shortForecast.toLowerCase();
    if (forecast.includes('heavy snow')) return 90;
    if (forecast.includes('snow likely')) return 70;
    if (forecast.includes('chance of snow')) return 50;
    if (forecast.includes('slight chance of snow')) return 30;
    if (forecast.includes('snow')) return 40;
    return 0;
  }

  static extractSnowAccumulation(forecast: string): number {
    const matches = forecast.match(/(\d+(?:\.\d+)?)\s*(?:to\s*(\d+(?:\.\d+)?))?\s*inches?/i);
    if (!matches) return 0;
    if (matches[2]) {
      return (parseFloat(matches[1]) + parseFloat(matches[2])) / 2;
    }
    return parseFloat(matches[1]);
  }

  static extractWindSpeed(windSpeed: string): number {
    const matches = windSpeed.match(/(\d+)/);
    return matches ? parseInt(matches[1]) : 0;
  }

  static formatDate(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  static getAlertSeverityColor(severity: AlertSeverity): string {
    const colors = {
      [AlertSeverity.EXTREME]: '#ff1744',
      [AlertSeverity.SEVERE]: '#ff5722',
      [AlertSeverity.MODERATE]: '#ffa726',
      [AlertSeverity.MINOR]: '#2196f3'
    };
    return colors[severity] || '#2196f3';
  }

  static parseWeatherOutlook(text: string): WeatherOutlook {
    // Implement parsing logic for Hazardous Weather Outlook if needed.
    return {
      issuedBy: '',
      issuedAt: '',
      regions: [],
      dayOne: text,
      extendedOutlook: '',
      spotterInfo: ''
    };
  }
}

export interface WeatherComponentProps {
  alerts?: WeatherAlert[];
  forecast?: HourlyForecast[];
  currentConditions?: WeatherPeriod;
  serviceStatus?: ServiceStatus;
  isLoading?: boolean;
  error?: string | null;
}
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  tension?: number;
  yAxisID?: string;
  fill?: boolean;
  backgroundColor?: string;
}

export interface ChartOptions {
  plugins?: {
    legend?: {
      display?: boolean;
      labels?: {
        color?: string;
      };
    };
    tooltip?: {
      enabled?: boolean;
      mode?: string;
      callbacks?: {
        [key: string]: (context: any) => string;
      };
    };
  };
  scales?: {
    [key: string]: {
      type?: string;
      display?: boolean;
      position?: string;
      grid?: {
        color?: string;
        display?: boolean;
        drawBorder?: boolean;
      };
      ticks?: {
        color?: string;
        callback?: (value: any) => string;
      };
      title?: {
        display?: boolean;
        text?: string;
        color?: string;
        font?: {
          size?: number;
          weight?: string;
        };
      };
    };
  };
  responsive?: boolean;
  maintainAspectRatio?: boolean;
}
