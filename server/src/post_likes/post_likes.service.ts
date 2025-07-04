import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostLikeDto } from './dto/create-post_like.dto';
import { PostLikeEntity } from './entities/post_like.entity';

@Injectable()
export class PostLikesService {
  constructor(
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepository: Repository<PostLikeEntity>,
  ) {}

  async create(createPostLikeDto: CreatePostLikeDto) {
    const postLike = this.postLikeRepository.create(createPostLikeDto);
    return await this.postLikeRepository.save(postLike);
  }

  async findAll() {
    return await this.postLikeRepository.find();
  }

  async findOne(id: number) {
    return await this.postLikeRepository.findOne({ where: { likeIdx: id } });
  }

  async remove(id: number) {
    return await this.postLikeRepository.delete({ likeIdx: id });
  }
}
