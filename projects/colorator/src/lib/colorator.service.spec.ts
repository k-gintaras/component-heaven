import { TestBed } from '@angular/core/testing';

import { ColoratorService } from './colorator.service';

describe('ColoratorService', () => {
  let service: ColoratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColoratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
