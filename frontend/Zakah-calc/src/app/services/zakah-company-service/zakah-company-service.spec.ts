import { TestBed } from '@angular/core/testing';

import { ZakahCompanyService } from './zakah-company-service';

describe('ZakahCompanyService', () => {
  let service: ZakahCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZakahCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
