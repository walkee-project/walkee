import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  userId?: string;
  userEmail?: string;
  userName?: string;
  userProfile?: string;
  userPoint?: number;
}
