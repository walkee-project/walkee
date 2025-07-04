import { Module } from '@nestjs/common';
import { CommentLikesService } from './comment_likes.service';
import { CommentLikesController } from './comment_likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLikeEntity } from './entities/comment_like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentLikeEntity])],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
  exports: [CommentLikesService], // 다른 모듈에서 사용 할 겅우
})
export class CommentLikesModule {}
