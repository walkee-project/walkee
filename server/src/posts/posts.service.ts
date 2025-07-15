import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return await this.postRepository.save(post);
  }

  async findAll() {
    return await this.postRepository.find({
      where: { postDeletedAt: IsNull() },
    });
  }

  async findOne(id: number) {
    return await this.postRepository.findOne({
      where: { postIdx: id, postDeletedAt: IsNull() },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update({ postIdx: id }, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.postRepository.update(
      { postIdx: id },
      {
        postDeletedAt: new Date(),
      },
    );
  }

  async countByUser(userId: number) {
    return this.postRepository.count({
      where: { userIdx: userId, postDeletedAt: IsNull() },
    });
  }
}
