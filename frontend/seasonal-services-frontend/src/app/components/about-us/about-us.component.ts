import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import * as L from 'leaflet';

gsap.registerPlugin(ScrollTrigger, Flip);

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
  stats: {
    label: string;
    value: number;
    suffix: string;
  }[];
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  @ViewChild('parallaxContainer') parallaxContainer!: ElementRef<HTMLElement>;
  @ViewChild('counterSection') counterSection!: ElementRef<HTMLElement>;

  currentServiceIndex = 0;
  countersStarted = false;

  services: ServiceCard[] = [
    {
      id: 'snow',
      title: 'Snow Removal',
      description: 'Professional snow management since 2020',
      icon: 'ac_unit',
      features: [
        '24/7 Emergency Response',
        'Commercial & Residential',
        'Modern Equipment Fleet',
        'Professional Ice Management',
      ],
      image: 'assets/snow-removal.jpg',
      stats: [
        { label: 'Properties Served', value: 150, suffix: '+' },
        { label: 'Snow Events', value: 500, suffix: '+' },
      ],
    },
    {
      id: 'lawn',
      title: 'Lawn Care',
      description: 'New service launching Spring 2024',
      icon: 'grass',
      features: [
        'Professional Mowing',
        'Seasonal Cleanup',
        'Landscape Maintenance',
        'Quality Equipment',
      ],
      image: 'assets/lawn-care.jpg',
      stats: [
        { label: 'Service Area', value: 25, suffix: ' miles' },
        { label: 'Equipment Fleet', value: 8, suffix: ' units' },
      ],
    },
    {
      id: 'market',
      title: "Alex's Market",
      description: 'Your new neighborhood grocery store',
      icon: 'store',
      features: [
        'Fresh Local Produce',
        'Quality Groceries',
        'Iowa Products',
        'Community Focus',
      ],
      image: 'assets/market.jpg',
      stats: [
        { label: 'Local Suppliers', value: 20, suffix: '+' },
        { label: 'Product Selection', value: 1000, suffix: '+ items' },
      ],
    },
  ];

  private map!: L.Map;

  constructor() {}

  ngOnInit() {
    this.initializeParallaxEffect();
  }

  ngAfterViewInit() {
    this.initializeAnimations();
    this.initializeScrollTriggers();
    this.initMap();
  }

  onServiceCardHover(isEntering: boolean, target: EventTarget | null) {
    const element = target as HTMLElement | null;
    if (!element) return;

    gsap.to(element, {
      scale: isEntering ? 1.02 : 1,
      boxShadow: isEntering
        ? '0 20px 40px rgba(0,0,0,0.3)'
        : '0 10px 20px rgba(0,0,0,0.1)',
      duration: 0.3,
    });
  }

  flipCard(target: EventTarget | null) {
    const element = target as HTMLElement | null;
    if (!element) return;

    const card = element.closest('.service-card');
    if (!card) return;

    const state = Flip.getState(card);
    card.classList.toggle('flipped');
    Flip.from(state, {
      duration: 0.6,
      ease: 'power2.inOut',
    });
  }

  private initializeParallaxEffect() {
    requestAnimationFrame(this.updateParallax.bind(this));
  }

  private updateParallax() {
    if (!this.parallaxContainer?.nativeElement) return;

    const scrolled = window.pageYOffset;
    const parallaxElements = this.parallaxContainer.nativeElement.querySelectorAll(
      '.parallax'
    );

    parallaxElements.forEach((el: Element) => {
      if (el instanceof HTMLElement) {
        const speed = parseFloat(el.getAttribute('data-speed') || '0');
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });

    requestAnimationFrame(this.updateParallax.bind(this));
  }

  private initializeAnimations() {
    gsap.from('.service-card', {
      duration: 1,
      y: 100,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      },
    });

    this.initializeCounters();
  }

  private initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach((counter: Element) => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      gsap.to(counter, {
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        scrollTrigger: {
          trigger: counter,
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }

  private initializeScrollTriggers() {
    gsap.utils.toArray('.reveal-section').forEach((section: any) => {
      gsap.from(section, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.parallax-bg').forEach((section: any) => {
      gsap.to(section, {
        backgroundPosition: `50% ${innerHeight / 2}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }
  private initMap(): void {
    this.map = L.map('map', {
      center: [41.661128, -91.530168],
      zoom: 12,
    });


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Add marker and circle for Iowa City
    L.marker([41.661128, -91.530168] as L.LatLngTuple)
      .addTo(this.map)
      .bindPopup('Iowa City - We Serve Here!')
      .openPopup();

    L.circle([41.661128, -91.530168] as L.LatLngTuple, {
      color: 'blue',
      fillColor: '#007bff',
      fillOpacity: 0.2,
      radius: 5000, // Radius in meters
    })
      .addTo(this.map)
      .bindPopup('Service Area: Iowa City');

    // Add marker and circle for Muscatine
    L.marker([41.4245, -91.0430] as L.LatLngTuple)
      .addTo(this.map)
      .bindPopup('Muscatine - Serving You!');

    L.circle([41.4245, -91.0430] as L.LatLngTuple, {
      color: 'green',
      fillColor: '#00ff00',
      fillOpacity: 0.2,
      radius: 5000, // Radius in meters
    })
      .addTo(this.map)
      .bindPopup('Service Area: Muscatine');
  }
}
