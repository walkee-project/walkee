import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentLikeDto } from './dto/create-comment_like.dto';
import { CommentLikeEntity } from './entities/comment_like.entity';

@Injectable()
export class CommentLikesService {
  constructor(
    @InjectRepository(CommentLikeEntity)
    private readonly commentLikeRepository: Repository<CommentLikeEntity>,
  ) {}

  async create(createCommentLikeDto: CreateCommentLikeDto) {
    const commentLike = this.commentLikeRepository.create(createCommentLikeDto);
    return await this.commentLikeRepository.save(commentLike);
  }

  async findAll() {
    return await this.commentLikeRepository.find();
  }

  async findOne(id: number) {
    return await this.commentLikeRepository.findOne({
      where: { likeIdx: id },
    });
  }

  async remove(id: number) {
    return await this.commentLikeRepository.delete({ likeIdx: id });
  }
}
