// lawn-care-service-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface ServiceSection {
  title: string;
  description: string;
  bulletPoints: string[];
  imageUrl: string;
  imageAlt: string;
  reversed?: boolean;
}

interface SeasonalPackage {
  season: string;
  title: string;
  description: string;
  services: string[];
  icon: string;
  color: string;
}

@Component({
  selector: 'app-lawn-care-service-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './lawn-care-service-page.component.html',
  styleUrls: ['./lawn-care-service-page.component.css']
})
export class LawnCareServicePageComponent {
  serviceSections: ServiceSection[] = [
    {
      title: 'Professional Lawn Maintenance',
      description: 'Transform your lawn into a vibrant, healthy landscape with our comprehensive maintenance services. Our experienced team uses professional-grade equipment and sustainable practices to keep your yard looking its best throughout the growing season.',
      bulletPoints: [
        'Custom mowing schedules based on grass type and growth patterns',
        'Precise edging and trimming for a manicured look',
        'Professional mulching to retain moisture and suppress weeds',
        'Regular soil testing and pH balancing',
        'Environmentally friendly weed control solutions'
      ],
      imageUrl: 'https://media.istockphoto.com/id/177391388/photo/mulching-around-the-bushes.jpg?s=2048x2048&w=is&k=20&c=nYXjJIAml6jBKTupjVWFsO-cxwBHwMWlSlVFwZTu8uI=',
      imageAlt: 'Professional lawn maintenance'
    },
    {
      title: 'Landscape Design & Installation',
      description: 'Create the outdoor space of your dreams with our custom landscape design services. We combine artistic vision with horticultural expertise to develop sustainable, beautiful landscapes that enhance your property value and lifestyle.',
      bulletPoints: [
        'Custom design consultations with certified landscapers',
        'Native plant selection for sustainable beauty',
        'Hardscape integration including patios and walkways',
        'Water-efficient irrigation system design',
        'Professional installation and project management'
      ],
      imageUrl: 'https://media.istockphoto.com/id/92624397/photo/summer-garden.jpg?s=2048x2048&w=is&k=20&c=rcCRzG_Y3PXnPkHXChfFcqHrPzq__qaUupH6MitPlyE=',
      imageAlt: 'Landscape design services',
      reversed: true
    },
    {
      title: 'Specialized Treatments & Care',
      description: 'Keep your lawn healthy and resilient with our specialized treatment programs. Our science-based approach ensures your lawn receives the right care at the right time for optimal growth and disease resistance.',
      bulletPoints: [
        'Seasonal fertilization programs',
        'Targeted pest management solutions',
        'Disease prevention and treatment',
        'Core aeration and overseeding',
        'Soil amendment and conditioning'
      ],
      imageUrl: 'https://media.istockphoto.com/id/1174599934/photo/spraying-pesticide-with-portable-sprayer-to-eradicate-garden-weeds-in-the-lawn-weedicide.jpg?s=2048x2048&w=is&k=20&c=nlhm2B93S6VrJP_m_odDotUnZVz62pLFRlGB576PP1A=',
      imageAlt: 'Lawn treatment application'
    }
  ];

  seasonalPackages: SeasonalPackage[] = [
    {
      season: 'Spring',
      title: 'Spring Package',
      description: 'Wake up your lawn from winter dormancy',
      services: [
        'Deep cleaning and debris removal',
        'First fertilizer application',
        'Pre-emergent weed control',
        'Core aeration',
        'Overseeding bare spots'
      ],
      icon: 'eco',
      color: '#4CAF50'
    },
    {
      season: 'Summer',
      title: 'Summer Package',
      description: 'Maintain a lush, green lawn all summer',
      services: [
        'Weekly precision mowing',
        'Balanced fertilization',
        'Targeted weed control',
        'Grub prevention',
        'Irrigation management'
      ],
      icon: 'wb_sunny',
      color: '#FFC107'
    },
    {
      season: 'Fall',
      title: 'Fall Package',
      description: 'Prepare your lawn for winter dormancy',
      services: [
        'Leaf removal and cleanup',
        'Winterizing fertilizer',
        'Final mowing and trim',
        'Soil testing',
        'Winter protection application'
      ],
      icon: 'park',
      color: '#FF5722'
    }
  ];

  serviceHighlights = [
    {
      icon: 'star',
      title: 'Expert Care',
      description: 'Certified lawn care professionals'
    },
    {
      icon: 'eco',
      title: 'Eco-Friendly',
      description: 'Sustainable practices and products'
    },
    {
      icon: 'schedule',
      title: 'Reliable Service',
      description: 'Consistent, scheduled maintenance'
    },
    {
      icon: 'local_offer',
      title: 'Custom Plans',
      description: 'Tailored to your lawns needs'
    }
  ];

  maintenancePlans = [
    {
      title: 'Essential Care',
      price: 'From $89/visit',
      description: 'Basic lawn maintenance package',
      features: [
        'Precision mowing',
        'Edge trimming',
        'Cleanup and debris removal',
        'Monthly inspections'
      ]
    },
    {
      title: 'Premium Care',
      price: 'From $149/visit',
      description: 'Comprehensive lawn care program',
      features: [
        'All Essential Care services',
        'Fertilization program',
        'Weed control',
        'Seasonal treatments'
      ]
    },
    {
      title: 'Complete Care',
      price: 'From $199/visit',
      description: 'Ultimate lawn care experience',
      features: [
        'All Premium Care services',
        'Pest management',
        'Soil amendments',
        'Priority scheduling'
      ]
    }
  ];
}
