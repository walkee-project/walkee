import { Test, TestingModule } from '@nestjs/testing';
import { RouteLikesController } from './route_likes.controller';
import { RouteLikesService } from './route_likes.service';

describe('RouteLikesController', () => {
  let controller: RouteLikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteLikesController],
      providers: [RouteLikesService],
    }).compile();

    controller = module.get<RouteLikesController>(RouteLikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
