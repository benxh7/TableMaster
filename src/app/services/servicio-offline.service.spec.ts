import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OfflineQueueService } from './servicio-offline.service';

describe('OfflineQueueService', () => {
  let service: OfflineQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OfflineQueueService]
    });
    service = TestBed.inject(OfflineQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});