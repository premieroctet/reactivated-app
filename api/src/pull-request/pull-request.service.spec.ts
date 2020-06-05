import { Test, TestingModule } from '@nestjs/testing';
import { PullRequestService } from './pull-request.service';

describe('PullRequestService', () => {
  let service: PullRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PullRequestService],
    }).compile();

    service = module.get<PullRequestService>(PullRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
