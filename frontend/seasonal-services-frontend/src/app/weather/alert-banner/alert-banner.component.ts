// alert-banner.component.ts
import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject, takeUntil } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import {
  WeatherAlert,
  AlertSeverity,
  WeatherUtils
} from '../interfaces/weather.interfaces';
import { trigger, transition, style, animate, state, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-alert-banner',
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './alert-banner.component.html',
  styleUrls: ['./alert-banner.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ]),
    trigger('expansionState', [
      state('expanded', style({ height: '*' })),
      state('collapsed', style({ height: '0', overflow: 'hidden' })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('rotateIcon', [
      state('expanded', style({ transform: 'rotate(180deg)' })),
      state('collapsed', style({ transform: 'rotate(0)' })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('staggeredFade', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AlertBannerComponent implements OnInit, OnDestroy {
  @Input() alerts: WeatherAlert[] = [];
  private expandedAlerts = new Set<number>();
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.alerts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(alerts => {
        if (!this.alerts || this.alerts.length === 0) {
          this.alerts = alerts;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isExpanded(index: number): boolean {
    return this.expandedAlerts.has(index);
  }

  toggleAlert(index: number): void {
    if (this.expandedAlerts.has(index)) {
      this.expandedAlerts.delete(index);
    } else {
      this.expandedAlerts.add(index);
    }
  }

  getAlertIcon(alert: WeatherAlert): string {
    if (alert.severity === AlertSeverity.EXTREME) return 'warning';
    if (alert.severity === AlertSeverity.SEVERE) return 'error';
    if (alert.urgency === 'Immediate') return 'priority_high';
    return alert.outlook ? 'schedule' : 'info';
  }

  isHighPriority(alert: WeatherAlert): boolean {
    return alert.severity === AlertSeverity.EXTREME ||
           alert.severity === AlertSeverity.SEVERE ||
           alert.urgency === 'Immediate';
  }

  hasSnowImpact(alert: WeatherAlert): boolean {
    const snowTerms = ['snow', 'winter', 'blizzard', 'ice'];
    return snowTerms.some(term =>
      alert.event.toLowerCase().includes(term) ||
      alert.description.toLowerCase().includes(term)
    );
  }

  formatDate(date: string): string {
    return WeatherUtils.formatDate(date);
  }

  setReminder(alert: WeatherAlert): void {
    console.log('Setting reminder for:', alert.event);
  }

  shareAlert(alert: WeatherAlert): void {
    if (navigator.share) {
      navigator.share({
        title: alert.event,
        text: `${alert.headline}\n\nExpires: ${this.formatDate(alert.expires)}`,
        url: window.location.href
      }).catch(console.error);
    }
  }

  scheduleService(alert: WeatherAlert): void {
    console.log('Scheduling service for:', alert.event);
  }
}
