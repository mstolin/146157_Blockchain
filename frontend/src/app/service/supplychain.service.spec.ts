import { TestBed } from '@angular/core/testing';

import { SupplychainService } from './supplychain.service';

describe('SupplychainService', () => {
  let service: SupplychainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplychainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
