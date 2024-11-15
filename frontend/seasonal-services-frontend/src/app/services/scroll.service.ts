import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToTop();
      });
  }

  scrollToTop(): void {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });

      // Backup scroll for complex layouts
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }, 100);
    } catch (err) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }
}
