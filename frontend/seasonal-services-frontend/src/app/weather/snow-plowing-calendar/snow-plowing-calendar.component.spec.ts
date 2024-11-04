import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnowPlowingCalendarComponent } from './snow-plowing-calendar.component';

describe('SnowPlowingCalendarComponent', () => {
  let component: SnowPlowingCalendarComponent;
  let fixture: ComponentFixture<SnowPlowingCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnowPlowingCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnowPlowingCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
