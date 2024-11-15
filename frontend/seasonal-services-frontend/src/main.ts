import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './app/custom-route-reuse-strategy';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
    provideAnimationsAsync(),
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ]
}).catch(err => console.error(err));
