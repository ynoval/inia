import { Test, TestingModule } from '@nestjs/testing';
import { GEEController } from './gee.controller';

describe('GEEController', () => {
  let controller: GEEController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GEEController],
    }).compile();

    controller = module.get<GEEController>(GEEController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
