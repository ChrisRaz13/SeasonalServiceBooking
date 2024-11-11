import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'emergency-service-24/7',
    loadComponent: () =>
      import('./components/emergency-service/emergency-service.component').then(
        (m) => m.EmergencyServiceComponent
      ),
  },
  {
    path: 'snowplowing-service-page',
    loadComponent: () =>
      import(
        './components/snow-plowing-service-page/snow-plowing-service-page.component'
      ).then((m) => m.SnowPlowingServicePageComponent),
  },
  {
    path: 'weather-dashboard',
    loadComponent: () =>
      import(
        './weather/snow-plowing-calendar/snow-plowing-calendar.component'
      ).then((m) => m.SnowPlowingCalendarComponent),
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./components/booking/booking.component').then(
        (m) => m.BookingComponent
      ),
  },
  {
    path: '**',
    redirectTo: '', // Redirect any unknown route to home
  },
];
