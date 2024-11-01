import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnowPlowingServicePageComponent } from './snow-plowing-service-page.component';

describe('SnowPlowingServicePageComponent', () => {
  let component: SnowPlowingServicePageComponent;
  let fixture: ComponentFixture<SnowPlowingServicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnowPlowingServicePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnowPlowingServicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
