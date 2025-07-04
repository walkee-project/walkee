import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateRouteDto {
  @IsOptional()
  @IsString()
  routeTitle?: string;

  @IsOptional()
  @IsString()
  routeDescription?: string;

  @IsOptional()
  @IsString()
  routeThumbnail?: string;

  @IsOptional()
  @IsNumber()
  routeRunCount?: number;

  @IsOptional()
  @IsDate()
  routeDeletedAt?: Date;
}
