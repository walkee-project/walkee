import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateRouteLikeDto {
  @IsNumber()
  @IsNotEmpty()
  userIdx: number;

  @IsNumber()
  @IsNotEmpty()
  routeIdx: number;
}
