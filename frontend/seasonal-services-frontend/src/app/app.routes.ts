import { provideRouter, RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'bookings', component: BookingFormComponent }
];
