import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceStatus } from '../interfaces/weather.interfaces';
import {
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
} from 'chart.js';


Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
);

interface ConditionThreshold {
  value: number;
  label: string;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
}

interface HourlyForecast {
  time: string;
  snowProbability: number;
  accumulation: number;
}

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnChanges, AfterViewInit {
  @Input() snowProbability: number = 0;
  @Input() accumulation: number = 0;
  @Input() groundTemp: number = 32;
  @Input() windSpeed: number = 0;
  @Input() serviceStatus: ServiceStatus = ServiceStatus.NOT_NEEDED;
  @Input() isServiceRequired: boolean = false;
  @Input() hourlyForecast: HourlyForecast[] = [];

  @ViewChild('snowChart') snowChartCanvas!: ElementRef;
  private chart: Chart | null = null;

  readonly snowProbabilityThresholds: ConditionThreshold[] = [
    { value: 30, label: 'Low Chance', severity: 'low' },
    { value: 60, label: 'Moderate Chance', severity: 'moderate' },
    { value: 80, label: 'High Chance', severity: 'high' }
  ];

  readonly windThresholds: ConditionThreshold[] = [
    { value: 10, label: 'Light Breeze', severity: 'low' },
    { value: 20, label: 'Moderate Wind', severity: 'moderate' },
    { value: 30, label: 'Strong Wind', severity: 'high' }
  ];

  statusClass: string = '';
  temperatureStatus: string = '';
  windStatus: string = '';

  ngAfterViewInit() {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serviceStatus']) {
      this.updateStatusClass();
    }
    if (changes['groundTemp']) {
      this.updateTemperatureStatus();
    }
    if (changes['windSpeed']) {
      this.updateWindStatus();
    }
    if (changes['hourlyForecast'] && this.chart) {
      this.updateChartData();
    }
  }

  private initializeChart() {
    if (!this.snowChartCanvas) return;

    const ctx = this.snowChartCanvas.nativeElement.getContext('2d');

    console.log('Chart Data:', {
      labels: this.getNext24Hours(),
      snowProbs: this.hourlyForecast.map(h => h.snowProbability),
      accumulations: this.hourlyForecast.map(h => h.accumulation)
    });

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.getNext24Hours(),
        datasets: [
          {
            label: 'Snow Probability (%)',
            data: this.hourlyForecast.map(h => h.snowProbability),
            borderColor: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            yAxisID: 'probability',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Accumulation (inches)',
            data: this.hourlyForecast.map(h => h.accumulation),
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            yAxisID: 'accumulation',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#ffffff',
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${value.toFixed(1)}`;
              }
            }
          }
        },
        scales: {
          probability: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 100,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#2196f3',
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Probability (%)',
              color: '#2196f3'
            }
          },
          accumulation: {
            type: 'linear',
            position: 'right',
            min: 0,
            grid: {
              display: false
            },
            ticks: {
              color: '#4caf50',
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Accumulation (inches)',
              color: '#4caf50'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff',
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 12
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChartData() {
    if (!this.chart) return;

    console.log('Updating chart with data:', {
      labels: this.getNext24Hours(),
      probabilities: this.hourlyForecast.map(h => h.snowProbability),
      accumulations: this.hourlyForecast.map(h => h.accumulation)
    });

    this.chart.data.labels = this.getNext24Hours();
    this.chart.data.datasets[0].data = this.hourlyForecast.map(h => h.snowProbability);
    this.chart.data.datasets[1].data = this.hourlyForecast.map(h => h.accumulation);
    this.chart.update();
  }

  private getNext24Hours(): string[] {
    return this.hourlyForecast
      .slice(0, 24)
      .map(h => h.time);
  }

  private updateStatusClass(): void {
    const statusClasses = {
      [ServiceStatus.REQUIRED]: 'status-required',
      [ServiceStatus.MONITORING]: 'status-monitoring',
      [ServiceStatus.NOT_NEEDED]: 'status-normal'
    };
    this.statusClass = statusClasses[this.serviceStatus];
  }

  private updateTemperatureStatus(): void {
    if (this.groundTemp <= 20) {
      this.temperatureStatus = 'Rapid Snow Accumulation Likely';
    } else if (this.groundTemp <= 32) {
      this.temperatureStatus = 'Snow Accumulation Possible';
    } else {
      this.temperatureStatus = 'Snow May Not Stick';
    }
  }

  private updateWindStatus(): void {
    const threshold = this.findThreshold(this.windSpeed, this.windThresholds);
    this.windStatus = threshold ? threshold.label : 'Calm Conditions';
  }

  getProgressBarClass(value: number, thresholds: ConditionThreshold[]): string {
    const threshold = this.findThreshold(value, thresholds);
    return threshold ? `severity-${threshold.severity}` : '';
  }

  private findThreshold(value: number, thresholds: ConditionThreshold[]): ConditionThreshold | null {
    return thresholds
      .slice()
      .reverse()
      .find(t => value >= t.value) || null;
  }

  getTooltip(value: number, thresholds: ConditionThreshold[]): string {
    const threshold = this.findThreshold(value, thresholds);
    return threshold ? threshold.label : 'Low';
  }

  shouldShowRecommendation(): boolean {
    return this.accumulation >= 1.5 || this.snowProbability >= 50;
  }

  getServiceRecommendation(): string {
    if (this.accumulation >= 2) {
      return 'Service required - Expected accumulation exceeds threshold';
    } else if (this.snowProbability >= 70) {
      return 'Service recommended - High probability of significant snowfall';
    } else if (this.snowProbability >= 50) {
      return 'Monitor conditions - Moderate chance of snow';
    }
    return '';
  }

  getServiceWindow(): string {
    const highProbabilityHours = this.hourlyForecast
      .slice(0, 24)
      .filter(h => h.snowProbability >= 50);

    if (highProbabilityHours.length > 0) {
      const firstHour = highProbabilityHours[0].time;
      const lastHour = highProbabilityHours[highProbabilityHours.length - 1].time;
      return `${firstHour} - ${lastHour}`;
    }

    return 'No immediate service window';
  }
}
