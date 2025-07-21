import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
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

  async findOne(id: number, userIdx?: number) {
    const post = await this.postRepository.findOne({
      where: { postIdx: id, postDeletedAt: IsNull() },
    });
    if (!post) return null;
    // userIdx가 있으면 isLiked 포함
    let isLiked = false;
    if (userIdx) {
      const like = await this.postRepository.manager.query(
        'SELECT 1 FROM post_likes WHERE user_idx = ? AND post_idx = ? LIMIT 1',
        [userIdx, id]
      );
      isLiked = like.length > 0;
    }
    return { ...post, isLiked };
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

  async findByUser(userId: number) {
    return this.postRepository.find({
      where: { userIdx: userId, postDeletedAt: IsNull() },
      order: { postCreatedAt: 'DESC' }, // 최신순 정렬
    });
  }

  async incrementView(id: number) {
    // postCount 1 증가
    await this.postRepository.increment({ postIdx: id }, 'postCount', 1);
    return this.findOne(id);
  }

  async searchPosts(query: string) {
    if (!query) return [];
    return this.postRepository.find({
      where: [
        { postTitle: Like(`%${query}%`), postDeletedAt: IsNull() },
        { postContent: Like(`%${query}%`), postDeletedAt: IsNull() },
      ],
      order: { postCreatedAt: 'DESC' },
    });
  }
}
