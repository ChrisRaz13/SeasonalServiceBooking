import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription, interval } from 'rxjs';

interface ServiceCard {
  title: string;
  description: string;
  image: string;
  link: string;
  features: string[];
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  typingText = '';
  private phrases = ['Snow Plowing', 'Lawn Care', 'Property Maintenance'];
  private currentPhraseIndex = 0;
  private typingSpeed = 100;
  private deletingSpeed = 50;
  private pauseDuration = 2000;
  private typingSubscription?: Subscription;

  services: ServiceCard[] = [
    {
      title: 'Snow Plowing',
      description: '24/7 Professional Snow Removal Services',
      image: 'https://media.istockphoto.com/id/536778097/photo/highway-snow-plow.jpg?s=2048x2048&w=is&k=20&c=ns8LS-y1-jWpJks808sCFeeSP14oyrS-l3Su6FA2_U4=',
      link: '/snow-plowing',
      features: ['24/7 Emergency Service', 'Commercial & Residential', 'De-icing Available'],
      icon: 'ac_unit'
    },
    {
      title: 'Lawn Care',
      description: 'Complete Lawn Maintenance Services',
      image: 'https://media.istockphoto.com/id/2044312647/photo/professional-latino-man-using-a-riding-lawnmower-caring-for-a-park-with-a-landscaping-company.jpg?s=2048x2048&w=is&k=20&c=Ael-VrEpwZbobzfnGj8V7HBShBPVB81I7reWtxVcZ6o=',
      link: '/lawn-care',
      features: ['Weekly Mowing', 'Fertilization', 'Weed Control'],
      icon: 'grass'
    }
  ];

  testimonials = [
    {
      quote: "Alex Services has been maintaining our property for years. Their reliability and professionalism are unmatched!",
      author: "Sarah Johnson",
      role: "Homeowner",
      rating: 5
    },
    {
      quote: "The best snow removal service in Iowa City. They're always here when we need them most.",
      author: "Mike Thompson",
      role: "Business Owner",
      rating: 5
    }
  ];

  currentTestimonialIndex = 0;

  constructor() { }

  ngOnInit(): void {
    this.startTypingAnimation();
    this.rotateTestimonials();
  }

  ngOnDestroy(): void {
    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }
  }

  private startTypingAnimation(): void {
    let isDeleting = false;
    let charIndex = 0;

    this.typingSubscription = interval(this.typingSpeed).subscribe(() => {
      const currentPhrase = this.phrases[this.currentPhraseIndex];

      if (!isDeleting) {
        this.typingText = currentPhrase.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          this.delay(this.pauseDuration);
        }
      } else {
        this.typingText = currentPhrase.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
        }
      }
    });
  }

  private delay(ms: number): void {
    setTimeout(() => {}, ms);
  }

  private rotateTestimonials(): void {
    setInterval(() => {
      this.currentTestimonialIndex =
        (this.currentTestimonialIndex + 1) % this.testimonials.length;
    }, 5000);
  }

  scrollToSection(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
