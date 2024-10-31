import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component'; // Import the NavBarComponent
import { HomeComponent } from './components/home/home.component';
import { SnowPlowingCalendarComponent } from './components/snow-plowing-calendar/snow-plowing-calendar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule, NavBarComponent, HomeComponent, SnowPlowingCalendarComponent, FooterComponent], // Include NavBarComponent here
  template: `
    <app-nav-bar></app-nav-bar>

    <router-outlet></router-outlet>

    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'seasonal-services-frontend';
 }
