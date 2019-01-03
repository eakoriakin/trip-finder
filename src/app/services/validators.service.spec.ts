import { TestBed } from '@angular/core/testing';
import { ValidatorService } from './';

describe('ValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidatorService = TestBed.get(ValidatorService);
    expect(service).toBeTruthy();
  });
});
