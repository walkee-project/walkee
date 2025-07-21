import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  postTitle?: string;

  @IsOptional()
  @IsString()
  postContent?: string;

  @IsOptional()
  @IsString()
  postUploadImg?: string;

  @IsOptional()
  @IsString()
  postLocation?: string;

  @IsOptional()
  @IsDate()
  postDeletedAt?: Date;

  @IsOptional()
  @IsNumber()
  postCount?: number;
}
