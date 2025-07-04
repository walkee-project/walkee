import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService], // 다른 모듈에서 사용 할 겅우
})
export class CommentsModule {}
