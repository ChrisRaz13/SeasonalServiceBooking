import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { SnowPlowingCalendarComponent } from './components/snow-plowing-calendar/snow-plowing-calendar.component';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { AppComponent } from './app.component';

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
    path: 'bookings',
    component: BookingFormComponent // Bookings route
  },
  {
    path: 'snow-plowing-calendar',
    component: SnowPlowingCalendarComponent // Snow plowing calendar route
  },
  {
    path: '**',
    redirectTo: '' // Redirect any unknown route to home
  }
];
