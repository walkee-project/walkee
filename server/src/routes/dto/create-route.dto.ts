import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRouteDto {
  @IsNumber()
  @IsNotEmpty()
  userIdx: number;

  @IsString()
  @IsNotEmpty()
  routeTitle: string;

  @IsOptional()
  @IsString()
  routeDescription?: string;

  @IsNumber()
  @IsNotEmpty()
  routeTotalKm: number;

  @IsNumber()
  @IsNotEmpty()
  routeTotalTime: number;

  @IsString()
  @IsNotEmpty()
  routePolyline: string;

  @IsNumber()
  @IsNotEmpty()
  routeStartLat: number;

  @IsNumber()
  @IsNotEmpty()
  routeStartLng: number;

  @IsNumber()
  @IsNotEmpty()
  routeEndLat: number;

  @IsNumber()
  @IsNotEmpty()
  routeEndLng: number;

  @IsOptional()
  @IsString()
  routeThumbnail?: string;
}
