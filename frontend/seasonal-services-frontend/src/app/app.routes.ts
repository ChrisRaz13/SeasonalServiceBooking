import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { SnowPlowingCalendarComponent } from './components/snow-plowing-calendar/snow-plowing-calendar.component';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { AppComponent } from './app.component';
import { SnowPlowingServicePageComponent } from './components/snow-plowing-service-page/snow-plowing-service-page.component';
import { EmergencyServiceComponent } from './components/emergency-service/emergency-service.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent // Home as default route
  },
  {
    path: 'emergency-service-24/7',
    component: EmergencyServiceComponent // Emergency route
  },
  {
    path: 'snowplowing-service-page',
    component: SnowPlowingServicePageComponent // Snowplowing service page
  },
  {
    path: 'weather-dashboard',
    component: SnowPlowingCalendarComponent // Weather Dashboard
  },
  {
    path: '**',
    redirectTo: '' // Redirect any unknown route to home
  }
];
