import { TestBed, inject } from '@angular/core/testing';

import { WhiteListService } from './white-list.service';

describe('WhiteListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WhiteListService]
    });
  });

  it('should be created', inject([WhiteListService], (service: WhiteListService) => {
    expect(service).toBeTruthy();
  }));
});
