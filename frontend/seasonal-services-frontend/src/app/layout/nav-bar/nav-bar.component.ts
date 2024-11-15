import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavBarComponent implements OnInit {
  @ViewChild('navBar') navBar!: ElementRef;

  isScrolled = false;
  isMobile = false;
  showServices = false;
  showMobilePanel = false;
  showMobileServices = false;

  constructor(private router: Router) {
    // Close mobile panel on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobilePanel();
    });
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close services dropdown when clicking outside
    if (!event.target) return;

    const target = event.target as HTMLElement;
    if (!target.closest('.services-dropdown')) {
      this.showServices = false;
    }
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.closeMobilePanel();
    }
  }

  toggleServices() {
    this.showServices = !this.showServices;
  }

  toggleMobilePanel() {
    this.showMobilePanel = !this.showMobilePanel;
    if (!this.showMobilePanel) {
      this.showMobileServices = false;
    }
  }

  toggleMobileServices() {
    this.showMobileServices = !this.showMobileServices;
  }

  closeMobilePanel() {
    this.showMobilePanel = false;
    this.showMobileServices = false;
  }

  onEmergencyClick() {
    this.router.navigate(['/emergency-service-24-7']);
    this.closeMobilePanel();
  }
}
