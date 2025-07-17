import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoutesModule } from '../routes/routes.module';
import { PostsModule } from '../posts/posts.module';
import { RouteLikesModule } from '../route_likes/route_likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RoutesModule,
    PostsModule,
    RouteLikesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
