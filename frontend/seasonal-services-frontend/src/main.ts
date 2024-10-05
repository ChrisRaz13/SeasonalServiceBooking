import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

// Import your standalone components
import { ClientListComponent } from './app/components/client-list/client-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'clients', pathMatch: 'full' }, // Redirect root to clients
  { path: 'clients', component: ClientListComponent } // Route to display client list
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide routing
    provideHttpClient() // Provide HttpClientModule
  ]
}).catch(err => console.error(err));
