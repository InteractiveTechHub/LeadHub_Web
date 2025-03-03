/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeadManagerService } from './LeadManager.service';

describe('Service: LeadManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeadManagerService]
    });
  });

  it('should ...', inject([LeadManagerService], (service: LeadManagerService) => {
    expect(service).toBeTruthy();
  }));
});
