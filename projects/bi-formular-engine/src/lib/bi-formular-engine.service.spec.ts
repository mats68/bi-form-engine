import { TestBed } from '@angular/core/testing';

import { BiFormularEngineService } from './bi-formular-engine.service';

describe('BiFormularEngineService', () => {
  let service: BiFormularEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiFormularEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
