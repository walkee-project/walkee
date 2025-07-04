import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PostLikesService } from './post_likes.service';
import { CreatePostLikeDto } from './dto/create-post_like.dto';

@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post()
  create(@Body() createPostLikeDto: CreatePostLikeDto) {
    return this.postLikesService.create(createPostLikeDto);
  }

  @Get()
  findAll() {
    return this.postLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postLikesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postLikesService.remove(+id);
  }
}
