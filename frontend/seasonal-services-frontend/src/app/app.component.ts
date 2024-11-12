import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RouterModule } from '@angular/router';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { SnowPlowingCalendarComponent } from './weather/snow-plowing-calendar/snow-plowing-calendar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ViewportScroller, CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NavBarComponent,
    HomeComponent,
    SnowPlowingCalendarComponent,
    FooterComponent
  ],
  template: `
    <app-nav-bar></app-nav-bar>
    <router-outlet></router-outlet>
    <app-footer *ngIf="!isBookingRoute()"></app-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'seasonal-services-frontend';
  private currentUrl: string;
  currentRoute: string = '';

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.currentUrl = this.router.url;
    this.currentRoute = this.router.url;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (this.currentUrl === event.url) {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
        this.currentUrl = event.url;
      }
    });
  }

  isBookingRoute(): boolean {
    return this.currentRoute === '/booking';
  }
}
