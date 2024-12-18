import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-safety-tips-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './safety-tips-dialog.component.html',
  styleUrls: ['./safety-tips-dialog.component.css']
})
export class SafetyTipsDialogComponent {
  safetyCategories = [
    {
      title: 'Home Preparation',
      icon: 'home',
      tips: [
        'Stock up on essential supplies (food, water, medications)',
        'Have emergency heating equipment and fuel',
        'Install and test smoke alarms and carbon monoxide detectors',
        'Insulate water pipes to prevent freezing',
        'Have your heating system serviced',
        'Keep emergency contact numbers handy'
      ]
    },
    {
      title: 'Vehicle Safety',
      icon: 'directions_car',
      tips: [
        'Keep your gas tank at least half full',
        'Install good winter tires',
        'Keep an emergency kit in your car',
        'Check battery, wipers, and antifreeze levels',
        'Have a shovel and sand/cat litter for traction',
        'Keep a blanket and extra warm clothing in the car'
      ]
    },
    {
      title: 'During a Storm',
      icon: 'storm',
      tips: [
        'Stay indoors if possible',
        'Keep devices charged and have backup power banks',
        'Monitor local weather updates',
        'Check on elderly neighbors and vulnerable people',
        'Avoid overexertion when shoveling snow',
        'Watch for signs of frostbite and hypothermia'
      ]
    },
    {
      title: 'Power Outage Response',
      icon: 'power_off',
      tips: [
        'Keep refrigerator doors closed to maintain temperature',
        'Never use generators indoors',
        'Use flashlights instead of candles when possible',
        'Disconnect appliances to avoid surge when power returns',
        'Have a battery-powered radio for emergency updates',
        'Keep phone calls brief to preserve battery life'
      ]
    },
    {
      title: 'Emergency Signals',
      icon: 'warning',
      tips: [
        'Learn winter weather warning terms',
        'Keep emergency flares in your vehicle',
        'Have a whistle for signaling help',
        'Know how to signal for help if stranded',
        'Save emergency numbers in your phone',
        'Have a meeting point for family members'
      ]
    },
    {
      title: 'Health & First Aid',
      icon: 'medical_services',
      tips: [
        'Know symptoms of hypothermia and frostbite',
        'Keep a well-stocked first aid kit',
        'Have prescription medications filled',
        'Learn basic first aid and CPR',
        'Keep emergency blankets accessible',
        'Have hand/foot warmers available'
      ]
    }
  ];

  constructor(public dialogRef: MatDialogRef<SafetyTipsDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
