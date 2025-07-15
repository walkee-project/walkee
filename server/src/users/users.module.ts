import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoutesModule } from '../routes/routes.module';
import { PostsModule } from '../posts/posts.module';
import { PostLikesModule } from '../post_likes/post_likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RoutesModule,
    PostsModule,
    PostLikesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
