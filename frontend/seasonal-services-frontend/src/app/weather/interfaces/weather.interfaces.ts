// src/app/weather/interfaces/weather.interfaces.ts

/**
 * Represents a weather alert with severity and timing information
 */
export interface WeatherAlert {
  severity: string;     // The severity level of the alert (extreme, severe, moderate, minor)
  event: string;        // The type of weather event
  headline: string;     // Brief description of the alert
  description: string;  // Detailed description of the alert
  expires: string;      // Expiration date/time of the alert
}

/**
 * Represents hourly weather forecast data
 */
export interface HourlyForecast {
  time: string;           // Time of the forecast hour
  temperature: number;    // Temperature in degrees
  snowProbability: number;// Probability of snow (0-100)
  accumulation: number;   // Expected snow accumulation in inches
  windSpeed: number;      // Wind speed in mph
}

/**
 * Represents detailed weather conditions for a time period
 */
export interface WeatherPeriod {
  temperature: number;      // Temperature in degrees
  windSpeed: string;       // Wind speed with units (e.g., "10 mph")
  windDirection: string;   // Wind direction (e.g., "NW")
  shortForecast: string;   // Brief forecast description
  detailedForecast: string;// Detailed forecast description
  snowProbability: number; // Probability of snow (0-100)
  snowAmount: number;      // Expected snow accumulation in inches
  showDetails: boolean;    // UI state for showing/hiding detailed forecast
  timeOfDay: string;       // Label for the time period (e.g., "Tonight", "Monday")
  isDaytime: boolean;      // Whether this period is during daytime
  temperatureUnit: string; // Temperature unit (F or C)
}

/**
 * Represents a full day's forecast including day and night periods
 */
export interface DayForecast {
  date: string;            // Full date string
  dayOfWeek: string;       // Day of week (e.g., "Monday")
  highTemp: number;        // Day's high temperature
  lowTemp: number | null;  // Day's low temperature (null if not available)
  dayPeriod: WeatherPeriod;// Daytime forecast details
  nightPeriod?: WeatherPeriod;// Nighttime forecast details (optional)
}

// Utility type for chart data
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
    yAxisID?: string;
    fill?: boolean;
    backgroundColor?: string;
  }>;
}

// Type for chart options
export interface ChartOptions {
  plugins: {
    legend: {
      display: boolean;
      labels?: { color: string; }
    }
  };
  scales: {
    [key: string]: {
      type?: string;
      display?: boolean;
      position?: string;
      grid?: {
        color?: string;
        display?: boolean;
      };
      ticks?: {
        color?: string;
      };
      title?: {
        display?: boolean;
        text?: string;
        color?: string;
      };
    };
  };
  responsive?: boolean;
  maintainAspectRatio?: boolean;
}

// Service response types
export interface WeatherApiResponse {
  alerts?: {
    features?: Array<{
      properties: {
        severity: string;
        event: string;
        headline: string;
        description: string;
        expires: string;
      };
    }>;
  };
  hourly?: {
    properties?: {
      periods?: Array<{
        startTime: string;
        temperature: number;
        shortForecast: string;
        windSpeed: string;
      }>;
    };
  };
  forecast?: {
    properties?: {
      periods?: Array<{
        startTime: string;
        temperature: number;
        windSpeed: string;
        windDirection: string;
        shortForecast: string;
        detailedForecast: string;
        isDaytime: boolean;
        name: string;
        temperatureUnit: string;
      }>;
    };
  };
}

// Constants for weather conditions
export enum WeatherCondition {
  SNOW = 'SNOW',
  RAIN = 'RAIN',
  CLEAR = 'CLEAR',
  CLOUDY = 'CLOUDY',
  WINDY = 'WINDY',
  THUNDERSTORM = 'THUNDERSTORM'
}

// Service status types
export enum ServiceStatus {
  REQUIRED = 'Service Required',
  MONITORING = 'Monitor Conditions',
  NOT_NEEDED = 'No Service Needed'
}

// Alert severity levels
export enum AlertSeverity {
  EXTREME = 'extreme',
  SEVERE = 'severe',
  MODERATE = 'moderate',
  MINOR = 'minor'
}

// Helper function to determine snow probability
export function calculateSnowProbability(shortForecast: string): number {
  shortForecast = shortForecast.toLowerCase();
  if (shortForecast.includes('heavy snow')) return 90;
  if (shortForecast.includes('snow likely')) return 70;
  if (shortForecast.includes('chance of snow')) return 50;
  if (shortForecast.includes('slight chance of snow')) return 30;
  if (shortForecast.includes('snow')) return 40;
  return 0;
}

// Helper function to calculate snow accumulation from forecast string
export function extractSnowAccumulation(forecast: string): number {
  const matches = forecast.match(/(\d+(?:\.\d+)?)\s*(?:to\s*(\d+(?:\.\d+)?))?\s*inches?/i);
  if (!matches) return 0;

  if (matches[2]) {
    return (parseFloat(matches[1]) + parseFloat(matches[2])) / 2;
  }
  return parseFloat(matches[1]);
}

// Helper function to extract wind speed as number
export function extractWindSpeed(windSpeed: string): number {
  const matches = windSpeed.match(/(\d+)/);
  return matches ? parseInt(matches[1]) : 0;
}
