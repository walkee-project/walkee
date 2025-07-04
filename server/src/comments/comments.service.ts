import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepository.create(createCommentDto);
    return await this.commentRepository.save(comment);
  }

  async findAll() {
    return await this.commentRepository.find();
  }

  async findOne(id: number) {
    return await this.commentRepository.findOne({ where: { commentIdx: id } });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.commentRepository.update({ commentIdx: id }, updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.commentRepository.delete({ commentIdx: id });
  }
}
