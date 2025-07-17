import { Module } from '@nestjs/common';
import { RouteLikesService } from './route_likes.service';
import { RouteLikesController } from './route_likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteLikeEntity } from './entities/route_like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RouteLikeEntity])],
  controllers: [RouteLikesController],
  providers: [RouteLikesService],
  exports: [RouteLikesService], // 다른 모듈에서 사용 할 겅우
})
export class RouteLikesModule {}
