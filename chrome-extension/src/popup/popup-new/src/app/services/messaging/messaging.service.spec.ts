import { TestBed, inject } from '@angular/core/testing';

import { MessagingService } from './messaging.service';

describe('MessegingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagingService]
    });
  });

  it('should be created', inject([MessagingService], (service: MessagingService) => {
    expect(service).toBeTruthy();
  }));
});
