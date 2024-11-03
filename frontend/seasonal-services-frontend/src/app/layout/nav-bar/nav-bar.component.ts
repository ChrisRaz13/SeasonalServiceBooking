// nav-bar.component.ts
import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { gsap } from 'gsap';

interface NavMenuItem {
  label: string;
  route?: string;
  icon: string;
  children?: NavMenuItem[];
  color?: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('slideIn', [
      state('void', style({
        transform: 'translateY(-100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => *', [
        animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)')
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ],
  template: `
    <nav #navbar class="navbar" [class.scrolled]="isScrolled" [@slideIn]>
      <div class="navbar-backdrop"></div>

      <!-- Logo Section -->
      <div class="logo-section">
        <a routerLink="/" class="logo-link" #logoLink>
          <img src="assets/Logo_transparent.png" alt="Logo" class="logo-image" />
        </a>
      </div>

      <!-- Menu Button -->
      <button class="menu-button"
              (click)="toggleMenu()"
              [class.active]="isMenuOpen"
              (mouseenter)="playButtonAnimation()">
        <div class="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <!-- Navigation Items -->
      <div class="nav-items" [class.open]="isMenuOpen">
        <ng-container *ngFor="let item of menuItems; let i = index">
          <!-- Regular Menu Item -->
          <a *ngIf="!item.children"
             [routerLink]="item.route"
             class="nav-item"
             [class.active]="currentRoute === item.route"
             (mouseenter)="onItemHover(i)"
             (mouseleave)="onItemLeave(i)"
             [style.--hover-color]="item.color"
             [@fadeInOut]>
            <i [class]="item.icon"></i>
            <span>{{ item.label }}</span>
            <div class="item-background"></div>
          </a>

          <!-- Dropdown Menu Item -->
          <div *ngIf="item.children"
               class="dropdown"
               [class.open]="activeDropdown === i"
               (mouseenter)="openDropdown(i)"
               (mouseleave)="closeDropdown()">
            <button class="nav-item dropdown-trigger"
                    [style.--hover-color]="item.color">
              <i [class]="item.icon"></i>
              <span>{{ item.label }}</span>
              <i class="fas fa-chevron-down arrow"></i>
              <div class="item-background"></div>
            </button>
            <div class="dropdown-content" [@fadeInOut]>
              <a *ngFor="let child of item.children"
                 [routerLink]="child.route"
                 class="dropdown-item"
                 (mouseenter)="onSubItemHover($event)"
                 [style.--hover-color]="item.color">
                <i [class]="child.icon"></i>
                <span>{{ child.label }}</span>
              </a>
            </div>
          </div>
        </ng-container>

        <!-- Emergency Contact Button -->
        <button class="emergency-button" routerLink="emergency-service-24/7" (mouseenter)="playEmergencyAnimation()">
          <div class="pulse"></div>
          <i class="fas fa-phone-alt"></i>
          <span>24/7 Emergency</span>
        </button>
      </div>
    </nav>
  `,
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements AfterViewInit {
  @ViewChild('navbar') navbar!: ElementRef;
  @ViewChild('logoLink') logoLink!: ElementRef;

  isScrolled = false;
  isMenuOpen = false;
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
          route: 'snowplowing-service-page',
          icon: 'fas fa-snowflake',
          color: '#64B5F6'
        },
        {
          label: 'Lawn Care',
          route: '/lawn-care',
          icon: 'fas fa-leaf',
          color: '#81C784'
        }
      ]
    },
    {
      label: 'Weather',
      route: 'weather-dashboard',
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

  constructor() {}

  ngAfterViewInit() {
    this.initAnimations();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  private initAnimations() {
    // Initial load animation
    gsap.from(this.navbar.nativeElement, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Logo hover animation
    this.logoLink.nativeElement.addEventListener('mouseenter', () => {
      gsap.to(this.logoLink.nativeElement.querySelector('img'), {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    this.logoLink.nativeElement.addEventListener('mouseleave', () => {
      gsap.to(this.logoLink.nativeElement.querySelector('img'), {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      gsap.from('.nav-item', {
        x: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }

  onItemHover(index: number) {
    gsap.to(`nav-item:nth-child(${index + 1})`, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  onItemLeave(index: number) {
    gsap.to(`nav-item:nth-child(${index + 1})`, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.in'
    });
  }

  openDropdown(index: number) {
    this.activeDropdown = index;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  onSubItemHover(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    gsap.to(target, {
      x: 5,
      duration: 0.2,
      ease: 'power2.out'
    });
  }

  playButtonAnimation() {
    gsap.to('.menu-icon span', {
      scaleX: 1.2,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  }

  playEmergencyAnimation() {
    gsap.to('.emergency-button', {
      scale: 1.05,
      duration: 0.3,
      ease: 'elastic.out(1, 0.3)',
      yoyo: true,
      repeat: 1
    });
  }
}
