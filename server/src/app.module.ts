import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { DrawingsModule } from './drawings/drawings.module';
import { DrawingEntity } from './drawings/entities/drawing.entity';

@Module({
  imports: [
    // ConfigModule 먼저 로드
    ConfigModule.forRoot({
      isGlobal: true, // 전체에서 사용 가능
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
        entities: [UserEntity, DrawingEntity],
        synchronize: Boolean(config.get('DB_SYNC')), // 개발 단계에서만 true
        autoLoadEntities: true, // 자동으로 entity 인식
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    DrawingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
