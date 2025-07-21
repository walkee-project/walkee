import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoutesModule } from '../routes/routes.module';
import { PostsModule } from '../posts/posts.module';
import { RouteLikesModule } from '../route_likes/route_likes.module';
import { FollowsModule } from '../follows/follows.module';
import { RouteEntity } from 'src/routes/entities/route.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { RouteLikeEntity } from 'src/route_likes/entities/route_like.entity';
import { FollowEntity } from 'src/follows/entities/follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RouteEntity,
      PostEntity,
      RouteLikeEntity,
      FollowEntity,
    ]),
    RoutesModule,
    PostsModule,
    RouteLikesModule,
    FollowsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
