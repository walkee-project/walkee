import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePostLikeDto {
  @IsNumber()
  @IsNotEmpty()
  userIdx: number;

  @IsNumber()
  @IsNotEmpty()
  postIdx: number;
}
