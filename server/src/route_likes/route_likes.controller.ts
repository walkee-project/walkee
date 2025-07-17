import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RouteLikesService } from './route_likes.service';
import { CreateRouteLikeDto } from './dto/create-route_like.dto';

@Controller('route-likes')
export class RouteLikesController {
  constructor(private readonly routeLikesService: RouteLikesService) {}

  @Post()
  create(@Body() createRouteLikeDto: CreateRouteLikeDto) {
    return this.routeLikesService.create(createRouteLikeDto);
  }

  @Get('is-liked')
  async isLiked(
    @Query('userIdx') userIdx: number,
    @Query('routeIdx') routeIdx: number,
  ) {
    return {
      isLiked: await this.routeLikesService.isRouteLiked(userIdx, routeIdx),
    };
  }

  @Get()
  findAll() {
    return this.routeLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routeLikesService.findOne(+id);
  }

  @Delete()
  removeByUserAndRoute(@Body() body: { userIdx: number; routeIdx: number }) {
    return this.routeLikesService.removeByUserAndRoute(
      body.userIdx,
      body.routeIdx,
    );
  }
}
