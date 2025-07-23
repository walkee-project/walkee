import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostLikeEntity } from '../post_likes/entities/post_like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepository: Repository<PostLikeEntity>,
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
      relations: ['user'],
    });
    if (!post) return null;
    // userIdx가 있으면 isLiked 포함
    let isLiked = false;
    if (userIdx) {
      const like = await this.postRepository.manager.query(
        'SELECT 1 FROM post_likes WHERE user_idx = ? AND post_idx = ? LIMIT 1',
        [userIdx, id],
      );
      isLiked = like.length > 0;
    }
    return {
      ...post,
      userName: post.user?.userName,
      userProfile: post.user?.userProfile,
      isLiked,
    };
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
    const posts = await this.postRepository.find({
      where: { userIdx: userId, postDeletedAt: IsNull() },
      order: { postCreatedAt: 'DESC' }, // 최신순 정렬
    });

    // 각 게시글에 likeCount 추가
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await this.getLikeCount(post.postIdx);
        return { ...post, likeCount };
      }),
    );

    return postsWithLikes;
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

  async getLikeCount(postIdx: number): Promise<number> {
    return this.postLikeRepository.count({ where: { postIdx } });
  }
}
