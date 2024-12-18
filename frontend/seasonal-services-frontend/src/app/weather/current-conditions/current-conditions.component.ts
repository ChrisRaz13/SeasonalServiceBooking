// current-conditions.component.ts
import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
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

interface HourlyForecast {
  time: string;
  snowProbability: number;
  temperature: number;
  windSpeed: number;
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
  template: `
    <mat-card class="forecast-card">
      <mat-card-header>
        <mat-card-title class="white-text">24-Hour Snow Forecast</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="chart-container">
          <canvas #forecastChart></canvas>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .forecast-card {
      background: #1c2a3e;
      border-radius: 12px;
      margin: 20px;
      padding: 20px;
    }

    .white-text {
      color: #ffffff !important;
    }

    .chart-container {
      position: relative;
      height: 400px;
      width: 100%;
      margin: 20px 0;
    }

    mat-card-subtitle,
    mat-card-content {
      color: #ffffff !important;
    }
  `]
})
export class CurrentConditionsComponent implements OnChanges, AfterViewInit {
  @Input() set data(value: HourlyForecast[]) {
    if (value && value.length > 0) {
      this.hourlyForecast = value;
      if (this.chart) {
        this.updateChartData();
      }
    }
  }

  hourlyForecast: HourlyForecast[] = [];
  @ViewChild('forecastChart') forecastChartCanvas!: ElementRef;
  private chart: Chart | null = null;

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeChart();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      if (this.chart) {
        this.updateChartData();
      } else {
        this.initializeChart();
      }
    }
  }

  private initializeChart() {
    if (!this.forecastChartCanvas || !this.hourlyForecast.length) return;

    const ctx = this.forecastChartCanvas.nativeElement.getContext('2d');

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
            fill: true,
            tension: 0.4,
            yAxisID: 'probability'
          },
          {
            label: 'Temperature (°F)',
            data: this.hourlyForecast.map(h => h.temperature),
            borderColor: '#ff4081',
            backgroundColor: 'rgba(255, 64, 129, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'temperature'
          },
          {
            label: 'Wind Speed (mph)',
            data: this.hourlyForecast.map(h => h.windSpeed),
            borderColor: '#69f0ae',
            backgroundColor: 'rgba(105, 240, 174, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'windSpeed'
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
              text: 'Snow Probability (%)',
              color: '#2196f3'
            }
          },
          temperature: {
            type: 'linear',
            position: 'right',
            grid: {
              display: false
            },
            ticks: {
              color: '#ff4081',
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Temperature (°F)',
              color: '#ff4081'
            }
          },
          windSpeed: {
            type: 'linear',
            position: 'right',
            offset: true,
            grid: {
              display: false
            },
            ticks: {
              color: '#69f0ae',
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Wind Speed (mph)',
              color: '#69f0ae'
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
    if (!this.chart || !this.hourlyForecast.length) return;

    this.chart.data.labels = this.getNext24Hours();
    this.chart.data.datasets[0].data = this.hourlyForecast.map(h => h.snowProbability);
    this.chart.data.datasets[1].data = this.hourlyForecast.map(h => h.temperature);
    this.chart.data.datasets[2].data = this.hourlyForecast.map(h => h.windSpeed);
    this.chart.update();
  }

  private getNext24Hours(): string[] {
    return this.hourlyForecast
      .slice(0, 24)
      .map(h => h.time);
  }
}
