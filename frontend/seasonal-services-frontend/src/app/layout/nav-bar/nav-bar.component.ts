import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { animate, style, transition, trigger } from '@angular/animations';
import * as Headroom from 'headroom.js';
import { gsap } from 'gsap';

interface NavMenuItem {
  label: string;
  route?: string;
  icon?: string;
  children?: NavMenuItem[];
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class NavBarComponent implements AfterViewInit {
  @ViewChild('navbar') navbar!: ElementRef;
  isScrolled = false;
  navbarOpen = false;

  menuItems: NavMenuItem[] = [
    {
      label: 'Home',
      route: '/',
      icon: 'home'
    },
    {
      label: 'Services',
      icon: 'build',
      children: [
        { label: 'Snow Plowing', route: '/snow-plowing-calendar', icon: 'ac_unit' },
        { label: 'Lawn Care', route: '/lawn-care', icon: 'grass' }
      ]
    },
    {
      label: 'Book Now',
      route: '/bookings',
      icon: 'event'
    },
    {
      label: 'Contact',
      route: '/contact',
      icon: 'phone'
    }
  ];

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initHeadroom();
    this.initLogoAnimation();
    this.adjustBodyPadding();
    window.addEventListener('resize', this.adjustBodyPadding.bind(this));
  }

  private initHeadroom(): void {
    const options = {
      offset: 80,
      tolerance: 5,
      classes: {
        initial: "headroom",
        pinned: "headroom--pinned",
        unpinned: "headroom--unpinned",
        top: "headroom--top",
        notTop: "headroom--not-top"
      }
    };

    const headroom = new Headroom(this.navbar.nativeElement, options);
    headroom.init();
  }

  private initLogoAnimation(): void {
    const logo = this.elRef.nativeElement.querySelector('.logo-image');

    gsap.from(logo, {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "power2.out"
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;

    if (this.navbarOpen) {
      gsap.from('.navbar-links a', {
        duration: 0.5,
        y: -20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }

  adjustBodyPadding(): void {
    const navbarHeight = this.navbar.nativeElement.offsetHeight;
    this.renderer.setStyle(document.body, 'padding-top', `${navbarHeight}px`);
  }
}
