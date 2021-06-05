import { Test, TestingModule } from '@nestjs/testing';
import { GrasslandCommunityController } from './grassland-community.controller';

describe('GrasslandCommunityController', () => {
  let controller: GrasslandCommunityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrasslandCommunityController],
    }).compile();

    controller = module.get<GrasslandCommunityController>(GrasslandCommunityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
