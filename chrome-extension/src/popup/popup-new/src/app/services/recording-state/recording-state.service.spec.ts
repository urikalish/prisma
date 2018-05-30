import { TestBed, inject } from '@angular/core/testing';

import { RecordingStateService } from './recording-state.service';

describe('RecordingStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecordingStateService]
    });
  });

  it('should be created', inject([RecordingStateService], (service: RecordingStateService) => {
    expect(service).toBeTruthy();
  }));
});
