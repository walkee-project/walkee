import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
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

  @Get('by-user-post/:userIdx/:postIdx')
  async findByUserAndPost(@Param('userIdx') userIdx: string, @Param('postIdx') postIdx: string) {
    return this.postLikesService.findByUserAndPost(+userIdx, +postIdx);
  }

  @Delete('by-user-post/:userIdx/:postIdx')
  async removeByUserAndPost(@Param('userIdx') userIdx: string, @Param('postIdx') postIdx: string) {
    return this.postLikesService.removeByUserAndPost(+userIdx, +postIdx);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postLikesService.remove(+id);
  }
}
