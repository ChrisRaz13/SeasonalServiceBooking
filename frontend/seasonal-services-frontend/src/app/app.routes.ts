import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EmergencyServiceComponent } from './components/emergency-service/emergency-service.component';
import { SnowPlowingServicePageComponent } from './components/snow-plowing-service-page/snow-plowing-service-page.component';
import { SnowPlowingCalendarComponent } from './weather/snow-plowing-calendar/snow-plowing-calendar.component';
import { BookingComponent } from './components/booking/booking.component';
import { LawnCareServicePageComponent } from './components/lawn-care-service-page/lawn-care-service-page.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home | Alex Services' },
  { path: 'emergency-service-24-7', component: EmergencyServiceComponent, title: '24/7 Emergency Services' },
  { path: 'snowplowing-service-page', component: SnowPlowingServicePageComponent, title: 'Snow Removal Services' },
  { path: 'lawn-care-service-page', component: LawnCareServicePageComponent, title: 'Lawn Care Services'},
  { path: 'weather-dashboard', component: SnowPlowingCalendarComponent, title: 'Weather Dashboard' },
  { path: 'booking', component: BookingComponent, title: 'Book a Service' },
  { path: 'about-us', component: AboutUsComponent, title: 'About Us'},
  { path: 'services/:id', component: ServiceDetailComponent},
  {
    path: 'commercial-snow',
    redirectTo: 'services/commercial-snow'
  },
  {
    path: 'ice-management',
    redirectTo: 'services/ice-management'
  },
  {
    path: 'seasonal-programs',
    redirectTo: 'services/seasonal-programs'
  },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
