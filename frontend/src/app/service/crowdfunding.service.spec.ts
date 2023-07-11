import { TestBed } from '@angular/core/testing';

import { CrowdfundingService } from './crowdfunding.service';

describe('CrowdfundingService', () => {
  let service: CrowdfundingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrowdfundingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
