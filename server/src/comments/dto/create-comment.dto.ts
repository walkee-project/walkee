import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  userIdx: number;

  @IsNumber()
  @IsNotEmpty()
  postIdx: number;

  @IsString()
  @IsNotEmpty()
  commentContent: string;
}
