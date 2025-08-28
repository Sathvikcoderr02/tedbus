import { TestBed } from '@angular/core/testing';

import { VirtualTourService } from './virtual-tour.service';

describe('VirtualTourService', () => {
  let service: VirtualTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
