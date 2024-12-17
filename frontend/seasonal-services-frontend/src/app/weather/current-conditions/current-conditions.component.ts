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
  templateUrl: './current-conditions.component.html',
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
