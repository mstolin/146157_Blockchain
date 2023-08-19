import { TestBed } from '@angular/core/testing';

import { SupplyChainService } from './supplychain.service';

describe('SupplychainService', () => {
  let service: SupplyChainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyChainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
