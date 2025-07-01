export class CreateDrawingDto {
  userId: string;
  drawingTitle: string;
  drawingDescription?: string;
  drawingThumbnail?: string; // 선택사항이면 ? 붙이기
}
