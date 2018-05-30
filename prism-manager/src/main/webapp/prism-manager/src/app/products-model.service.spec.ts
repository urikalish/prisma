import { TestBed, inject } from '@angular/core/testing';

import { ProductsModelService } from './products-model.service';

describe('ProductsModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsModelService]
    });
  });

  it('should be created', inject([ProductsModelService], (service: ProductsModelService) => {
    expect(service).toBeTruthy();
  }));
});
