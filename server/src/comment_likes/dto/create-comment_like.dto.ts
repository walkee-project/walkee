import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCommentLikeDto {
  @IsNumber()
  @IsNotEmpty()
  userIdx: number;

  @IsNumber()
  @IsNotEmpty()
  commentIdx: number;
}
