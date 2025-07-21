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
    // 이미 존재하는지 확인
    const exists = await this.postLikeRepository.findOne({
      where: {
        userIdx: createPostLikeDto.userIdx,
        postIdx: createPostLikeDto.postIdx,
      },
    });
    if (exists) {
      // 이미 좋아요한 경우, 에러 대신 성공 메시지 반환
      return { message: 'already liked' };
    }
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

  async findByUserAndPost(userIdx: number, postIdx: number) {
    return await this.postLikeRepository.findOne({ where: { userIdx, postIdx } });
  }

  async removeByUserAndPost(userIdx: number, postIdx: number) {
    return await this.postLikeRepository.delete({ userIdx, postIdx });
  }
}
