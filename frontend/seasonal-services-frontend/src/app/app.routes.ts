// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Home | Alex Services'
  },
  {
    path: 'emergency-service-24-7',
    loadComponent: () =>
      import('./components/emergency-service/emergency-service.component').then(m => m.EmergencyServiceComponent),
    title: '24/7 Emergency Services'
  },
  {
    path: 'snowplowing-service-page',
    loadComponent: () =>
      import('./components/snow-plowing-service-page/snow-plowing-service-page.component').then(m => m.SnowPlowingServicePageComponent),
    title: 'Snow Removal Services'
  },
  {
    path: 'weather-dashboard',
    loadComponent: () =>
      import('./weather/snow-plowing-calendar/snow-plowing-calendar.component').then(m => m.SnowPlowingCalendarComponent),
    title: 'Weather Dashboard'
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./components/booking/booking.component').then(m => m.BookingComponent),
    title: 'Book a Service'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // Automatically scrolls to top on route change
      anchorScrolling: 'enabled'            // Enables anchor scrolling
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
