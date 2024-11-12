import { Component, HostListener, OnInit, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { gsap } from 'gsap';

interface NavMenuItem {
  label: string;
  route?: string;
  icon: string;
  children?: NavMenuItem[];
  color?: string;
  open?: boolean;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class NavBarComponent implements OnInit, AfterViewInit {
  @ViewChild('navbar') navbar!: ElementRef;
  @ViewChild('logoLink') logoLink!: ElementRef;

  private router = inject(Router);

  isScrolled = false;
  isMobile = false;
  mobileMenuOpen = false;
  activeDropdown: number | null = null;
  currentRoute = '/';

  menuItems: NavMenuItem[] = [
    {
      label: 'Home',
      route: '/',
      icon: 'fas fa-home',
      color: '#4CAF50'
    },
    {
      label: 'Services',
      icon: 'fas fa-concierge-bell',
      color: '#2196F3',
      children: [
        {
          label: 'Snow Removal',
          route: '/snowplowing-service',
          icon: 'fas fa-snowflake'
        },
        {
          label: 'Lawn Care',
          route: '/lawn-care',
          icon: 'fas fa-leaf'
        }
      ]
    },
    {
      label: 'Weather',
      route: '/weather',
      icon: 'fas fa-cloud-sun',
      color: '#FF9800'
    },
    {
      label: 'Booking',
      route: '/booking',
      icon: 'fas fa-calendar-check',
      color: '#E91E63'
    }
  ];

  ngOnInit() {
    this.checkViewport();
    this.currentRoute = this.router.url;
  }

  ngAfterViewInit() {
    this.initAnimations();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  private checkViewport() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  private initAnimations() {
    if (!this.isMobile && this.logoLink?.nativeElement) {
      this.logoLink.nativeElement.addEventListener('mouseenter', () => {
        gsap.to(this.logoLink.nativeElement.querySelector('img'), {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      this.logoLink.nativeElement.addEventListener('mouseleave', () => {
        gsap.to(this.logoLink.nativeElement.querySelector('img'), {
          scale: 1,
          duration: 0.3,
          ease: 'power2.inOut'
        });
      });
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleMobileDropdown(item: NavMenuItem) {
    item.open = !item.open;
  }

  onItemHover(index: number) {
    if (!this.isMobile) {
      gsap.to(`nav-item-${index}`, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }

  onItemLeave(index: number) {
    if (!this.isMobile) {
      gsap.to(`nav-item-${index}`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }

  openDropdown(index: number) {
    this.activeDropdown = index;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  playEmergencyAnimation() {
    if (!this.isMobile) {
      gsap.to('.emergency-btn', {
        scale: 1.05,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)',
        yoyo: true,
        repeat: 1
      });
    }
  }
}
