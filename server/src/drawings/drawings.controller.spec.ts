import { Test, TestingModule } from '@nestjs/testing';
import { DrawingsController } from './drawings.controller';
import { DrawingsService } from './drawings.service';

describe('DrawingsController', () => {
  let controller: DrawingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrawingsController],
      providers: [DrawingsService],
    }).compile();

    controller = module.get<DrawingsController>(DrawingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
