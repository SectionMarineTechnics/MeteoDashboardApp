import { TestBed } from '@angular/core/testing';

import { GoogleChartsBaseService } from './google-charts-base.service';

describe('GoogleChartsBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleChartsBaseService = TestBed.get(GoogleChartsBaseService);
    expect(service).toBeTruthy();
  });
});
