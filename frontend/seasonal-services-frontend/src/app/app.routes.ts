import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EmergencyServiceComponent } from './components/emergency-service/emergency-service.component';
import { SnowPlowingServicePageComponent } from './components/snow-plowing-service-page/snow-plowing-service-page.component';
import { SnowPlowingCalendarComponent } from './weather/snow-plowing-calendar/snow-plowing-calendar.component';
import { BookingComponent } from './components/booking/booking.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home | Alex Services' },
  { path: 'emergency-service-24-7', component: EmergencyServiceComponent, title: '24/7 Emergency Services' },
  { path: 'snowplowing-service-page', component: SnowPlowingServicePageComponent, title: 'Snow Removal Services' },
  { path: 'weather-dashboard', component: SnowPlowingCalendarComponent, title: 'Weather Dashboard' },
  { path: 'booking', component: BookingComponent, title: 'Book a Service' },
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
