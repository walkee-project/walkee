import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  commentContent?: string;

  @IsOptional()
  @IsNumber()
  commentParentId?: number;

  @IsOptional()
  @IsDate()
  commentDeletedAt?: Date;
}
