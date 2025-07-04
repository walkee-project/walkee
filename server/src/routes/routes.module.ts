import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { RouteEntity } from './entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RouteEntity])],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService], // 다른 모듈에서 사용 할 겅우
})
export class RoutesModule {}
