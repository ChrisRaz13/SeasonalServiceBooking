import { provideRouter, RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { HomeComponent } from './components/home/home.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { SnowPlowingCalendarComponent } from './components/snow-plowing-calendar/snow-plowing-calendar.component';

export const routes = [
  { path: '', component: HomeComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/edit/:id', component: ClientFormComponent }, // Edit route with ':id' parameter
  { path: 'bookings', component: BookingFormComponent },
  { path: 'snow-plowing-calendar', component: SnowPlowingCalendarComponent },
];

