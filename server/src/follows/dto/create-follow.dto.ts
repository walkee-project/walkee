import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
  @IsNumber()
  @IsNotEmpty()
  userIdx: number;

  @IsNumber()
  @IsNotEmpty()
  routeIdx: number;

  @IsString()
  @IsNotEmpty()
  followTitle: string;

  @IsNumber()
  @IsNotEmpty()
  followTotalKm: number;

  @IsNumber()
  @IsNotEmpty()
  followTotalTime: number;

  @IsString()
  @IsNotEmpty()
  followPolyline: string;

  @IsNumber()
  @IsNotEmpty()
  followStartLat: number;

  @IsNumber()
  @IsNotEmpty()
  followStartLng: number;

  @IsNumber()
  @IsNotEmpty()
  followEndLat: number;

  @IsNumber()
  @IsNotEmpty()
  followEndLng: number;

  @IsOptional()
  @IsString()
  followThumbnail?: string;

  @IsNumber()
  @IsNotEmpty()
  followCompleted: number;
}
