import { TestBed, inject } from '@angular/core/testing';

import { GridModelService } from './grid-model.service';

describe('GridModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridModelService]
    });
  });

  it('should be created', inject([GridModelService], (service: GridModelService) => {
    expect(service).toBeTruthy();
  }));
});
