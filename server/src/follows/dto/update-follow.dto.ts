import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateFollowDto {
  @IsOptional()
  @IsString()
  followTitle?: string;

  @IsOptional()
  @IsString()
  followThumbnail?: string;

  @IsOptional()
  @IsDate()
  followDeletedAt?: Date;
}
