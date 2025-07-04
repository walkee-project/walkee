import { IsOptional, IsString, IsDate } from 'class-validator';

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
  @IsDate()
  postDeletedAt?: Date;
}
