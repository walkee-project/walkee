import { PartialType } from '@nestjs/mapped-types';
import { CreateRouteDto } from './create-route.dto';

export class UpdateRouteDto extends PartialType(CreateRouteDto) {
  routeTitle?: string;
  routeDescription?: string;
  routeRunCount?: number;
  routeThumbnail?: string;
  routeDeletedAt?: Date;
}
