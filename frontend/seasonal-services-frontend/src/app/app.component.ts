import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RouterModule } from '@angular/router';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { SnowPlowingCalendarComponent } from './components/snow-plowing-calendar/snow-plowing-calendar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
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
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'seasonal-services-frontend';
  private currentUrl: string;

  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    // Store the initial URL
    this.currentUrl = this.router.url;

    // Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Scroll to top if navigating to the same route
        if (this.currentUrl === event.url) {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
        // Update the current URL to the new one
        this.currentUrl = event.url;
      }

      if (event instanceof NavigationEnd) {
        // Scroll to top on every route change
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
