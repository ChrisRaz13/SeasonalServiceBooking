import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WeatherAlert } from '../interfaces/weather.interfaces.js';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="alert-banner" *ngIf="alerts.length > 0" @slideDown>
      <div *ngFor="let alert of alerts" [class]="'alert-card severity-' + alert.severity">
        <div class="alert-icon">
          <mat-icon>warning</mat-icon>
        </div>
        <div class="alert-content">
          <h3>{{alert.event}}</h3>
          <p>{{alert.headline}}</p>
          <span class="alert-expires">Expires: {{formatDate(alert.expires)}}</span>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class AlertBannerComponent {
  @Input() alerts: WeatherAlert[] = [];

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}
