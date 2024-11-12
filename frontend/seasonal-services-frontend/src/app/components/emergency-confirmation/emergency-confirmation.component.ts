import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EmergencyRequest } from '../../services/emergency-request.service';

@Component({
  selector: 'app-emergency-confirmation',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="confirmation-container">
      <!-- Emergency Header -->
      <div class="confirmation-header">
        <div class="emergency-badge">
          <div class="pulse-ring"></div>
          <span class="icon">⚡</span>
          Emergency Request Confirmed
        </div>
      </div>

      <!-- Response Time Banner -->
      <div class="response-time">
        <span class="icon">⏱️</span>
        Estimated Response Time: <strong>30 minutes</strong>
      </div>

      <!-- Request Details -->
      <div class="details-section">
        <h3>Request Details</h3>
        <div class="details-grid">
          <div class="detail-item">
            <span class="label">Name:</span>
            <span class="value">{{ data.name }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Phone:</span>
            <span class="value">{{ formatPhone(data.phone) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Address:</span>
            <span class="value">{{ data.address }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Service:</span>
            <span class="value">{{ data.serviceType }}</span>
          </div>
          <div class="detail-item" *ngIf="data.description">
            <span class="label">Details:</span>
            <span class="value">{{ data.description }}</span>
          </div>
        </div>
      </div>

      <!-- Important Notice -->
      <div class="notice-section">
        <p>A confirmation SMS will be sent to your phone shortly.</p>
        <p>For immediate assistance, call: <strong>(800) 123-4567</strong></p>
      </div>

      <!-- Action Button -->
      <div class="action-section">
        <button class="close-button" (click)="close()">
          Close
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      background-color: #1a2a3f;
      color: white;
      border-radius: 8px;
      overflow: hidden;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    }

    .confirmation-header {
      background-color: #ff4444;
      padding: 1.5rem;
      text-align: center;
    }

    .emergency-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: bold;
      position: relative;
    }

    .pulse-ring {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }

    .response-time {
      background-color: rgba(168, 216, 255, 0.1);
      padding: 1rem;
      text-align: center;
      color: #a8d8ff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .details-section {
      padding: 1.5rem;
    }

    .details-section h3 {
      color: #a8d8ff;
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
    }

    .details-grid {
      display: grid;
      gap: 1rem;
    }

    .detail-item {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 1rem;
      align-items: baseline;
    }

    .label {
      color: #a8d8ff;
      font-weight: 500;
    }

    .value {
      color: white;
    }

    .notice-section {
      background-color: rgba(168, 216, 255, 0.05);
      padding: 1rem;
      text-align: center;
      font-size: 0.9rem;
      color: #a8d8ff;
    }

    .action-section {
      padding: 1rem;
      display: flex;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.2);
    }

    .close-button {
      background-color: #2c5c8f;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .close-button:hover {
      background-color: #3670ab;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(168, 216, 255, 0.2);
    }

    .icon {
      display: inline-block;
      margin-right: 0.5rem;
    }
  `]
})
export class EmergencyConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<EmergencyConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmergencyRequest
  ) {}

  formatPhone(phone: string): string {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  close(): void {
    this.dialogRef.close();
  }
}
