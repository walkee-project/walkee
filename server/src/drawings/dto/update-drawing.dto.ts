import { PartialType } from '@nestjs/mapped-types';
import { CreateDrawingDto } from './create-drawing.dto';

export class UpdateDrawingDto extends PartialType(CreateDrawingDto) {
  userId?: string;
  drawingTitle?: string;
  drawingDescription?: string;
  drawingThumbnail?: string; // 선택사항이면 ? 붙이기
}
