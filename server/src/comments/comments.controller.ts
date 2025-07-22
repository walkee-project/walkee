import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('by-post/:postIdx')
  async findByPost(@Param('postIdx') postIdx: string) {
    const comments = await this.commentsService.findByPost(Number(postIdx));
    // userName, userProfile 등 user 정보도 함께 반환
    return comments.map((c) => ({
      commentIdx: c.commentIdx,
      userIdx: c.userIdx,
      userName: c.user?.userName || '',
      userProfile: c.user?.userProfile || '',
      commentContent: c.commentContent,
      commentCreatedAt: c.commentCreatedAt,
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
