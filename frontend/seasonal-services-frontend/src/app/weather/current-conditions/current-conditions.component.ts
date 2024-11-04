// src/app/weather/current-conditions/current-conditions.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { ServiceStatus } from '../interfaces/weather.interfaces.js';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule, MatCardModule],
  template: `
    <mat-card class="current-conditions">
      <div class="conditions-grid">
        <div class="stat-box">
          <div class="stat-icon snowflake-icon">
            <mat-icon>ac_unit</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Snow Probability</h3>
            <div class="stat-value">{{snowProbability}}%</div>
            <div class="stat-progress">
              <mat-progress-bar mode="determinate"
                [value]="snowProbability"
                [class.high-probability]="snowProbability > 70">
              </mat-progress-bar>
            </div>
          </div>
        </div>

        <div class="stat-box">
          <div class="stat-icon accumulation-icon">
            <mat-icon>height</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Expected Accumulation</h3>
            <div class="stat-value">{{accumulation}}"</div>
            <div class="accumulation-indicator"
                 [class.service-required]="isServiceRequired">
              {{serviceStatus}}
            </div>
          </div>
        </div>

        <div class="stat-box">
          <div class="stat-icon temperature-icon">
            <mat-icon>thermostat</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Ground Temperature</h3>
            <div class="stat-value">{{groundTemp}}°F</div>
            <div class="temperature-note">{{temperatureNote}}</div>
          </div>
        </div>

        <div class="stat-box">
          <div class="stat-icon wind-icon">
            <mat-icon>air</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Wind Conditions</h3>
            <div class="stat-value">{{windSpeed}} mph</div>
            <div class="wind-note">{{windNote}}</div>
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {
  @Input() snowProbability: number = 0;
  @Input() accumulation: number = 0;
  @Input() groundTemp: number = 32;
  @Input() windSpeed: number = 0;
  @Input() serviceStatus: ServiceStatus = ServiceStatus.NOT_NEEDED;
  @Input() isServiceRequired: boolean = false;

  get temperatureNote(): string {
    return this.groundTemp <= 32 ? 'Snow Accumulation Likely' : 'Snow May Not Stick';
  }

  get windNote(): string {
    return this.windSpeed >= 15 ? 'Drifting Possible' : 'Minimal Drifting';
  }
}
