import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyConfirmationComponent } from './emergency-confirmation.component';

describe('EmergencyConfirmationComponent', () => {
  let component: EmergencyConfirmationComponent;
  let fixture: ComponentFixture<EmergencyConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
