import { Test, TestingModule } from '@nestjs/testing';
import { GEEService } from './gee.service';

describe('GEEService', () => {
  let service: GEEService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GEEService],
    }).compile();

    service = module.get<GEEService>(GEEService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
