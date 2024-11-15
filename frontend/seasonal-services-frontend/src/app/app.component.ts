import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule, Scroll } from '@angular/router';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { SnowPlowingCalendarComponent } from './weather/snow-plowing-calendar/snow-plowing-calendar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isBookingRoute()"></app-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const scrollToTop = () => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
          });
        };
        // Try immediate scroll
        scrollToTop();
        // Backup scroll after a brief delay
        setTimeout(scrollToTop, 100);
      });
  }

  ngOnInit() {
    // Set initial route
    this.currentRoute = this.router.url;
  }

  isBookingRoute(): boolean {
    return this.currentRoute === '/booking';
  }
}
