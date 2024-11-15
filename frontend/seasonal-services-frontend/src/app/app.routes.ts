import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home Route
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    title: 'Home | Alex Services'
  },

  // Emergency Service Route
  {
    path: 'emergency-service-24-7',
    loadComponent: () =>
      import('./components/emergency-service/emergency-service.component').then(
        (m) => m.EmergencyServiceComponent
      ),
    title: '24/7 Emergency Services'
  },

  // Services Routes
  {
    path: 'snowplowing-service-page',
    loadComponent: () =>
      import(
        './components/snow-plowing-service-page/snow-plowing-service-page.component'
      ).then((m) => m.SnowPlowingServicePageComponent),
    title: 'Snow Removal Services'
  },

  // Weather Dashboard
  {
    path: 'weather-dashboard',
    loadComponent: () =>
      import(
        './weather/snow-plowing-calendar/snow-plowing-calendar.component'
      ).then((m) => m.SnowPlowingCalendarComponent),
    title: 'Weather Dashboard'
  },

  // Booking Route
  {
    path: 'booking',
    loadComponent: () =>
      import('./components/booking/booking.component').then(
        (m) => m.BookingComponent
      ),
    title: 'Book a Service'
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: ''
  }
];
