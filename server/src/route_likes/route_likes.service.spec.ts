import { Test, TestingModule } from '@nestjs/testing';
import { RouteLikesService } from './route_likes.service';

describe('RouteLikesService', () => {
  let service: RouteLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteLikesService],
    }).compile();

    service = module.get<RouteLikesService>(RouteLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
