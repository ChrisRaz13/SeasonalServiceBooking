// service-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SafetyTipsDialogComponent } from '../safety-tips-dialog/safety-tips-dialog.component';

interface ServiceDetail {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  process: Array<{
    title: string;
    description: string;
  }>;
  pricingTiers: Array<{
    name: string;
    price: string;
    features: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    MatDialogModule
  ],
  // Template remains the same as your original
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  service?: ServiceDetail;
  serviceId: string = '';

  constructor( private route: ActivatedRoute,
  private dialog: MatDialog
  ){}


  openSafetyTips(): void {
    this.dialog.open(SafetyTipsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'safety-tips-dialog'
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.serviceId = params['id'];
      this.loadServiceDetails(this.serviceId);
    });
  }

  loadServiceDetails(serviceId: string) {
    // Map of all detail pages that correspond to "Learn More" buttons
    const serviceDetails: { [key: string]: ServiceDetail } = {
      'commercial-snow': {
        title: 'Commercial Snow Management',
        subtitle: 'Professional snow management solutions for businesses',
        heroImage: 'https://media.istockphoto.com/id/1093336802/photo/white-snowplow-service-truck-with-orange-lights-and-yellow-plow-blade-clearing-residential.jpg?s=2048x2048&w=is&k=20&c=E77pgJ3WTB0lGPJPULjy_UJ9nn2BLdFEK3PnlDgLlik=',
        description: 'Comprehensive snow removal solutions for Iowa City businesses. We understand the importance of maintaining safe, accessible premises for your customers and employees throughout winter.',
        features: [
          {
            icon: 'schedule',
            title: '24/7 Monitoring',
            description: 'Round-the-clock weather monitoring and rapid response'
          },
          {
            icon: 'business',
            title: 'Commercial Equipment',
            description: 'Heavy-duty equipment for large areas'
          },
          {
            icon: 'local_shipping',
            title: 'Snow Hauling',
            description: 'Professional snow hauling services'
          }
        ],
        process: [
          {
            title: 'Site Assessment',
            description: 'Detailed property evaluation and plan development'
          },
          {
            title: 'Custom Planning',
            description: 'Creating tailored snow management strategies'
          },
          {
            title: 'Service Execution',
            description: 'Professional clearing and maintenance'
          },
          {
            title: 'Documentation',
            description: 'Detailed service records and reporting'
          }
        ],
        pricingTiers: [
          {
            name: 'Basic Commercial',
            price: 'Starting at $200/visit',
            features: [
              'Parking lot clearing',
              'Walkway clearing',
              'Basic salt application'
            ]
          },
          {
            name: 'Premium Commercial',
            price: 'Starting at $350/visit',
            features: [
              'Everything in Basic',
              'Priority response',
              'Snow hauling',
              'Ice management',
              '24/7 monitoring'
            ]
          }
        ],
        faqs: [
          {
            question: 'What is your response time for commercial properties?',
            answer: 'Priority commercial clients receive service within 1 hour of reaching trigger depth.'
          },
          {
            question: 'Do you offer seasonal contracts?',
            answer: 'Yes, we offer seasonal contracts with guaranteed pricing and priority service.'
          }
        ]
      },
      'ice-management': {
        title: 'Ice Management & Prevention',
        subtitle: 'Proactive ice control solutions',
        heroImage: 'https://media.istockphoto.com/id/153760291/photo/snow-blower.jpg?s=2048x2048&w=is&k=20&c=d42aPUUyxNDm40D5H80dsZvrp68sRKZQS5hfvT6M7XQ=',
        description: 'Professional ice management services using environmentally conscious methods and materials. We focus on prevention and prompt treatment to ensure safety.',
        features: [
          {
            icon: 'warning',
            title: 'Pre-treatment',
            description: 'Anti-icing applications before winter events'
          },
          {
            icon: 'eco',
            title: 'Eco-Friendly',
            description: 'Environmental-conscious ice melt products'
          },
          {
            icon: 'architecture',
            title: 'Surface Protection',
            description: 'Careful application to protect surfaces'
          }
        ],
        process: [
          {
            title: 'Weather Monitoring',
            description: 'Continuous tracking of conditions'
          },
          {
            title: 'Pre-Treatment',
            description: 'Anti-icing application when needed'
          },
          {
            title: 'Active Management',
            description: 'Ongoing ice control during events'
          },
          {
            title: 'Post-Event Check',
            description: 'Follow-up inspections and treatment'
          }
        ],
        pricingTiers: [
          {
            name: 'Standard Ice Control',
            price: 'Starting at $75/application',
            features: [
              'Ice melt application',
              'Basic monitoring',
              'Post-event check'
            ]
          },
          {
            name: 'Premium Prevention',
            price: 'Starting at $125/application',
            features: [
              'Pre-treatment service',
              'Premium ice melt products',
              '24/7 monitoring',
              'Multiple applications as needed',
              'Surface protection'
            ]
          }
        ],
        faqs: [
          {
            question: 'What type of ice melt do you use?',
            answer: 'We use premium ice melt products that are effective at lower temperatures while being safer for concrete and vegetation.'
          },
          {
            question: 'How do you prevent ice formation?',
            answer: 'We use pre-treatment applications before winter events and monitor conditions 24/7 for proactive response.'
          }
        ]
      },
      'seasonal-programs': {
        title: 'Seasonal Lawn Services',
        subtitle: 'Year-round lawn care programs',
        heroImage: 'https://media.istockphoto.com/id/1419427334/photo/banner-a-human-lawn-mower-cuts-the-grass-in-the-backyard-agricultural-machinery-for-the-care.jpg?s=2048x2048&w=is&k=20&c=tMDk5EOOGu636didpzBMOY29ZXJjM07MlKfrTs6jgg4=',
        description: 'Comprehensive seasonal care programs designed to keep your lawn healthy throughout the year. From spring cleanup to fall preparation, our services ensure your lawn looks its best in every season.',
        features: [
          {
            icon: 'event',
            title: 'Scheduled Care',
            description: 'Regular maintenance on a seasonal schedule'
          },
          {
            icon: 'eco',
            title: 'Fertilization',
            description: 'Professional-grade fertilization programs'
          },
          {
            icon: 'pest_control',
            title: 'Weed Control',
            description: 'Targeted weed management solutions'
          }
        ],
        process: [
          {
            title: 'Spring Cleanup',
            description: 'Debris removal and initial treatment'
          },
          {
            title: 'Summer Maintenance',
            description: 'Regular care and monitoring'
          },
          {
            title: 'Fall Preparation',
            description: 'Winterization and leaf removal'
          },
          {
            title: 'Winter Planning',
            description: 'Program evaluation and adjustment'
          }
        ],
        pricingTiers: [
          {
            name: 'Basic Program',
            price: 'Starting at $200/month',
            features: [
              'Regular mowing',
              'Basic fertilization',
              'Seasonal cleanup'
            ]
          },
          {
            name: 'Premium Program',
            price: 'Starting at $350/month',
            features: [
              'Everything in Basic',
              'Advanced fertilization',
              'Weed control',
              'Pest management',
              'Priority scheduling'
            ]
          }
        ],
        faqs: [
          {
            question: 'What does seasonal cleanup include?',
            answer: 'Our cleanup services include leaf removal, debris clearing, bed maintenance, and preparation for the upcoming season.'
          },
          {
            question: 'How often do you apply fertilizer?',
            answer: 'We typically apply fertilizer 4-6 times per year, depending on your lawns needs and the selected program.'
          }
        ]
      }
    };

    this.service = serviceDetails[serviceId];
  }
}
