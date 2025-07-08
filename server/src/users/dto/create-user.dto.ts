import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userProvider: string;

  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsString()
  userProfile?: string; // 선택사항이면 ? 붙이기

  @IsOptional()
  @IsNumber()
  userPoint?: number;
}
