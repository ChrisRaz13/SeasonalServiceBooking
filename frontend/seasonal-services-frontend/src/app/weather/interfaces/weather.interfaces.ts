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

export interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  features: string[];
  link: string;
  buttonText: string;
}

export interface WeatherOutlook {
  issuedBy: string;
  issuedAt: string;
  regions: string[];
  dayOne: string;
  extendedOutlook: string;
  spotterInfo: string;
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
  probabilityOfPrecipitation?: {
    value: number | null;
    unitCode?: string;
  };
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

export interface WeatherApiResponse {
  alerts?: WeatherAlert[];
  hourly?: HourlyForecast[];
  forecast?: DayForecast[];
}

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
  static calculateSnowProbability(forecast: ForecastPeriod): number {
    // First check the direct probability value if available
    if (forecast.probabilityOfPrecipitation?.value != null) {
      if (forecast.shortForecast.toLowerCase().includes('snow')) {
        return forecast.probabilityOfPrecipitation.value;
      }
    }

    const shortForecast = forecast.shortForecast.toLowerCase();
    const detailedForecast = forecast.detailedForecast.toLowerCase();

    // Check for explicit percentages
    const percentMatch = detailedForecast.match(/(\d+)\s*percent\s*(?:chance|probability)\s*of\s*(?:snow|precipitation)/i);
    if (percentMatch) {
      return parseInt(percentMatch[1]);
    }

    // Check forecast descriptions
    if (shortForecast.includes('snow') || detailedForecast.includes('snow')) {
      if (shortForecast.includes('likely') || detailedForecast.includes('likely')) return 70;
      if (shortForecast.includes('chance') || detailedForecast.includes('chance')) return 50;
      if (shortForecast.includes('slight chance')) return 30;
      return 40; // Default if snow is mentioned but no probability given
    }

    return 0;
  }

  static extractSnowAccumulation(forecast: string): number {
    const lowercaseForecast = forecast.toLowerCase();

    // Look for specific accumulation mentions
    const accumPattern = /(?:new\s+)?snow\s+accumulation\s+of\s+(\d+(?:\.\d+)?)\s*(?:to\s+(\d+(?:\.\d+)?))?\s*inch(?:es)?/i;
    const matches = lowercaseForecast.match(accumPattern);

    if (matches) {
      if (matches[2]) {
        // If range is given (e.g., "1 to 2 inches"), take average
        return (parseFloat(matches[1]) + parseFloat(matches[2])) / 2;
      }
      return parseFloat(matches[1]);
    }

    // Check for descriptive terms if no specific measurements
    if (lowercaseForecast.includes('heavy snow')) return 4;
    if (lowercaseForecast.includes('moderate snow')) return 2;
    if (lowercaseForecast.includes('light snow')) return 0.5;

    return 0;
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
