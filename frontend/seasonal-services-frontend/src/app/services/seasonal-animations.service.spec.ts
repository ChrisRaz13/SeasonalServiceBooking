import { TestBed } from '@angular/core/testing';

import { SeasonalAnimationsService } from './seasonal-animations.service';

describe('SeasonalAnimationsService', () => {
  let service: SeasonalAnimationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonalAnimationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
