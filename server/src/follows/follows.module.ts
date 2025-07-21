import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { FollowEntity } from './entities/follow.entity';

@Module({
  controllers: [FollowsController],
  providers: [FollowsService],
  imports: [TypeOrmModule.forFeature([FollowEntity])],
  exports: [FollowsService], // 다른 모듈에서 사용 할 겅우
})
export class FollowsModule {}
