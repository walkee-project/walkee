export class CreateRouteDto {
  userIdx: number;
  routeTitle: string;
  routeDescription?: string;
  routeTotalKm: number;
  routeTotalTime: number;
  routePolyline: string;
  routeStartLat: number;
  routeStartLng: number;
  routeEndLat: number;
  routeEndLng: number;
  routeThumbnail?: string; // 선택사항이면 ? 붙이기
}
