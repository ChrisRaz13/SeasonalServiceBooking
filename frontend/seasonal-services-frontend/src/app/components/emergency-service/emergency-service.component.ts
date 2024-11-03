import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface ServiceType {
  icon: string;
  title: string;
  description: string;
  responseTime: string;
}

@Component({
  selector: 'app-emergency-service',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './emergency-service.component.html',
  styleUrls: ['./emergency-service.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)',
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('pulse', [
      state('active', style({})),
      transition('void => active', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class EmergencyServiceComponent implements OnInit, AfterViewInit {
  @ViewChild('blizzardCanvas') blizzardCanvas!: ElementRef<HTMLCanvasElement>;

  emergencyForm: FormGroup;
  emergencyPhone = '(800) 123-4567';
  responseTime = '30';
  isSubmitting = false;
  showBlizzard = true;

  emergencyServices: ServiceType[] = [
    {
      icon: 'warning',
      title: 'Critical Access',
      description: 'Immediate clearance for emergency vehicle access and critical situations.',
      responseTime: '15 min'
    },
    {
      icon: 'business',
      title: 'Commercial Emergency',
      description: '24/7 emergency snow removal for businesses and commercial properties.',
      responseTime: '20 min'
    },
    {
      icon: 'home',
      title: 'Residential Emergency',
      description: 'Rapid response for residential emergency snow removal needs.',
      responseTime: '30 min'
    },
    {
      icon: 'local_shipping',
      title: 'Supply Route Clearance',
      description: 'Emergency clearing of essential supply and delivery routes.',
      responseTime: '25 min'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private renderer: Renderer2
  ) {
    this.emergencyForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      serviceType: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    // Add frost effect to elements with frost class
    document.querySelectorAll('.frost').forEach(element => {
      this.addFrostEffect(element as HTMLElement);
    });
  }

  ngAfterViewInit() {
    this.initBlizzardAnimation();
  }

  private initBlizzardAnimation() {
    if (this.blizzardCanvas) {
      const canvas = this.blizzardCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Snowflake particles
        const particles: any[] = [];
        const particleCount = 200;

        // Create particles
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            density: Math.random() * 10,
            speed: Math.random() * 3 + 2
          });
        }

        // Animation function
        const animate = () => {
          if (!this.showBlizzard) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();

          particles.forEach(particle => {
            particle.y += particle.speed;
            particle.x += Math.sin(particle.density) * 2;

            if (particle.y > canvas.height) {
              particle.y = -10;
              particle.x = Math.random() * canvas.width;
            }

            ctx.moveTo(particle.x, particle.y);
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, true);
          });

          ctx.fill();
          requestAnimationFrame(animate);
        };

        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        });
      }
    }
  }

  private addFrostEffect(element: HTMLElement) {
    const frost = this.renderer.createElement('div');
    this.renderer.addClass(frost, 'frost-effect');
    this.renderer.appendChild(element, frost);
  }

  async onSubmit() {
    if (this.emergencyForm.valid) {
      this.isSubmitting = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.showSuccessMessage();
        this.emergencyForm.reset();
      } catch (error) {
        this.showErrorMessage();
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  private showSuccessMessage(): void {
    this.snackBar.open('Emergency request submitted successfully!', 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(): void {
    this.snackBar.open('Error submitting request. Please call our emergency number.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  scrollToForm(): void {
    document.getElementById('emergency-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  getFormControl(name: string) {
    return this.emergencyForm.get(name);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.getFormControl(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isFieldRequired(fieldName: string): boolean {
    const field = this.getFormControl(fieldName);
    return field?.hasError('required') || false;
  }

  isPhoneInvalid(): boolean {
    const phone = this.getFormControl('phone');
    return phone ? phone.hasError('pattern') && (phone.dirty || phone.touched) : false;
  }
}
