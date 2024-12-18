import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawnCareServicePageComponent } from './lawn-care-service-page.component';

describe('LawnCareServicePageComponent', () => {
  let component: LawnCareServicePageComponent;
  let fixture: ComponentFixture<LawnCareServicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawnCareServicePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LawnCareServicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
