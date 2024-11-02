import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { SnowPlowingCalendarComponent } from './components/snow-plowing-calendar/snow-plowing-calendar.component';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { AppComponent } from './app.component';
import { SnowPlowingServicePageComponent } from './components/snow-plowing-service-page/snow-plowing-service-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent // Home as default route
  },
  {
    path: 'clients',
    component: ClientListComponent // Clients route
  },
  {
    path: 'snowplowing-service-page',
    component: SnowPlowingServicePageComponent // Bookings route
  },
  {
    path: 'weather-dashboard',
    component: SnowPlowingCalendarComponent // Snow plowing calendar route
  },
  {
    path: '**',
    redirectTo: '' // Redirect any unknown route to home
  }
];
