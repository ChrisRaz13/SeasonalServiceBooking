import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface ServiceSection {
  title: string;
  description: string;
  bulletPoints: string[];
  imageUrl: string;
  imageAlt: string;
  reversed?: boolean;
}

@Component({
  selector: 'app-snow-plowing-service-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './snow-plowing-service-page.component.html',
  styleUrl: './snow-plowing-service-page.component.css'
})
export class SnowPlowingServicePageComponent {
  serviceSections: ServiceSection[] = [
    {
      title: 'Residential Snow Removal',
      description: 'Our residential snow removal service is designed to keep your property safe and accessible throughout the winter season. Using state-of-the-art equipment and experienced operators, we ensure your driveway, walkways, and steps are promptly cleared after every snowfall.',
      bulletPoints: [
        'Available 24/7 during snow events',
        'Professional snow plowing for driveways',
        'Hand shoveling for walkways and steps',
        'Ice melt application to prevent slipping',
        'Priority service for elderly and disabled residents'
      ],
      imageUrl: 'https://media.istockphoto.com/id/1830819858/photo/adult-man-removing-snow-with-snowblower-at-heavy-snowfall.jpg?s=2048x2048&w=is&k=20&c=br1XuM3FinZUV89QAwPeZy73n39ZsSIotVpQPgewjv4=',
      imageAlt: 'Residential snow removal service'
    },
    {
      title: 'Commercial Snow Management',
      description: 'Keep your business running smoothly during winter weather with our comprehensive commercial snow management services. We understand the importance of maintaining safe access for your customers and employees, and our team is equipped to handle properties of any size.',
      bulletPoints: [
        'Pre-storm preparation and salt application',
        'Parking lot plowing and snow hauling',
        'Sidewalk clearing and deicing',
        'Documented service records for liability protection',
        '24/7 monitoring and rapid response'
      ],
      imageUrl: 'https://media.istockphoto.com/id/157563475/photo/snow-plowing-truck-in-action.jpg?s=2048x2048&w=is&k=20&c=3yIzM6TWHeURscnahqUfXxNSRQC-jZFS1J4cnlPIbzw=',
      imageAlt: 'Commercial snow plowing service',
      reversed: true
    },
    {
      title: 'Specialized Equipment',
      description: 'We invest in the latest snow removal equipment to provide efficient and thorough service. Our fleet includes everything from heavy-duty plows to specialized sidewalk machines, ensuring we have the right tool for every job.',
      bulletPoints: [
        'Commercial-grade snow plows',
        'Skid steers with snow pushers',
        'Snow blowers for deep accumulation',
        'Salt spreaders for precise application',
        'Specialized sidewalk equipment'
      ],
      imageUrl: 'https://media.istockphoto.com/id/1365919155/photo/man-using-snowblower-in-deep-snow.jpg?s=2048x2048&w=is&k=20&c=V1A__GW6pHMYewLTdXOGge7ub15UPLVboJf69A5uhZ0=',
      imageAlt: 'Snow removal equipment'
    }
  ];

  serviceHighlights = [
    {
      icon: 'schedule',
      title: '24/7 Service',
      description: 'Round-the-clock availability during snow events'
    },
    {
      icon: 'groups',
      title: 'Experienced Team',
      description: 'Fully trained and insured snow removal professionals'
    },
    {
      icon: 'verified',
      title: 'Guaranteed Service',
      description: 'Satisfaction guaranteed on every job'
    },
    {
      icon: 'history',
      title: 'Quick Response',
      description: 'Fast response times when you need us most'
    }
  ];

  pricingOptions = [
    {
      title: 'Per Visit',
      description: 'Pay only when you need service',
      price: 'From $75',
      features: [
        'No commitment required',
        'Service on demand',
        'Priority scheduling available',
        'Flexible payment options'
      ]
    },
    {
      title: 'Monthly Contract',
      description: 'Regular service throughout winter',
      price: 'From $200/month',
      features: [
        'Guaranteed service',
        'Priority response',
        'Unlimited visits',
        'Ice management included'
      ]
    },
    {
      title: 'Seasonal Contract',
      description: 'Best value for the entire season',
      price: 'From $800/season',
      features: [
        'Best price guarantee',
        'Top priority service',
        'Unlimited snow removal',
        'Free spring cleanup'
      ]
    }
  ];
}
