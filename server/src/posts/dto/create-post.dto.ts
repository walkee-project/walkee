import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  userIdx: number;

  @IsString()
  @IsNotEmpty()
  postTitle: string;

  @IsString()
  @IsNotEmpty()
  postContent: string;

  @IsOptional()
  @IsString()
  postUploadImg?: string;

  @IsOptional()
  @IsString()
  postLocation?: string;
}
