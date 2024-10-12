import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component'; // Import the NavBarComponent
import { HomeComponent } from './components/home/home.component';
import { SnowPlowingCalendarComponent } from './components/snow-plowing-calendar/snow-plowing-calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavBarComponent, HomeComponent, SnowPlowingCalendarComponent], // Include NavBarComponent here
  template: `
    <app-nav-bar></app-nav-bar>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
