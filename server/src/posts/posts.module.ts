import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostLikeEntity } from 'src/post_likes/entities/post_like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostLikeEntity])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService], // 다른 모듈에서 사용 할 겅우
})
export class PostsModule {}
