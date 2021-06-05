import { Test, TestingModule } from '@nestjs/testing';
import { GrasslandCommunityService } from './grassland-community.service';

describe('GrasslandCommunityService', () => {
  let service: GRasslandCommunityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrasslandCommunityService],
    }).compile();

    service = module.get<GrasslandCommunityService>(GrasslandCommunityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
