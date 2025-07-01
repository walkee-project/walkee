import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrawingEntity } from './entities/drawing.entity';
import { DrawingsService } from './drawings.service';
import { DrawingsController } from './drawings.controller';
@Module({
  imports: [TypeOrmModule.forFeature([DrawingEntity])],
  controllers: [DrawingsController],
  providers: [DrawingsService],
})
export class DrawingsModule {}
