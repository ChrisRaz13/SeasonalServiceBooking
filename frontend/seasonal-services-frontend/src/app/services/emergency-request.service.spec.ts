import { TestBed } from '@angular/core/testing';

import { EmergencyRequestService } from './emergency-request.service';

describe('EmergencyRequestService', () => {
  let service: EmergencyRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
