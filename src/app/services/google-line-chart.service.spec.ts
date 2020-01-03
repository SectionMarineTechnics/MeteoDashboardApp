import { TestBed } from '@angular/core/testing';

import { GoogleLineChartService } from './google-line-chart.service';

describe('GoogleLineChartServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleLineChartService = TestBed.get(GoogleLineChartService);
    expect(service).toBeTruthy();
  });
});
