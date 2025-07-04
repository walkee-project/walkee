import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikesService } from './post_likes.service';
import { PostLikesController } from './post_likes.controller';
import { PostLikeEntity } from './entities/post_like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLikeEntity])],
  controllers: [PostLikesController],
  providers: [PostLikesService],
  exports: [PostLikesService], // 다른 모듈에서 사용 할 겅우
})
export class PostLikesModule {}
