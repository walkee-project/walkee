import * as crypto from 'crypto';
(global as any).crypto = crypto;
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { RoutesModule } from './routes/routes.module';
import { RouteEntity } from './routes/entities/route.entity';
import { PostsModule } from './posts/posts.module';
import { PostEntity } from './posts/entities/post.entity';
import { CommentsModule } from './comments/comments.module';
import { CommentEntity } from './comments/entities/comment.entity';
import { PostLikesModule } from './post_likes/post_likes.module';
import { PostLikeEntity } from './post_likes/entities/post_like.entity';
import { CommentLikesModule } from './comment_likes/comment_likes.module';
import { CommentLikeEntity } from './comment_likes/entities/comment_like.entity';
import { AuthModule } from './auth/auth.module';
import { UploadController } from './uploads/upload.controller';
import { RouteLikesModule } from './route_likes/route_likes.module';
import { FollowsModule } from './follows/follows.module';
import { FollowEntity } from './follows/entities/follow.entity';

@Module({
  imports: [
    // ConfigModule 먼저 로드
    ConfigModule.forRoot({
      isGlobal: true, // 전체에서 사용 가능
      envFilePath: process.cwd() + '/.env', // 절대 경로로 .env 파일 지정
    }),
    // TypeORM 설정에 ConfigService 주입
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [
          UserEntity,
          RouteEntity,
          PostEntity,
          CommentEntity,
          PostLikeEntity,
          CommentLikeEntity,
          FollowEntity,
        ],
        synchronize: false, // 개발 단계에서만 true
        autoLoadEntities: true, // 자동으로 entity 인식
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RoutesModule,
    PostsModule,
    CommentsModule,
    PostLikesModule,
    CommentLikesModule,
    RouteLikesModule,
    FollowsModule,
  ],
  controllers: [
    AppController,
    UploadController, // ✅ 썸네일 업로드 컨트롤러 등록
  ],
  providers: [AppService],
})
export class AppModule {}
