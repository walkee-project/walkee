import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { RouteEntity } from 'src/routes/entities/route.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { RouteLikeEntity } from 'src/route_likes/entities/route_like.entity';
import { FollowEntity } from 'src/follows/entities/follow.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RouteEntity)
    private routeRepository: Repository<RouteEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(RouteLikeEntity)
    private routeLikeRepository: Repository<RouteLikeEntity>,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { userIdx: id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { userEmail: email },
    });
  }

  async findByProviderAndId(provider: string, providerId: string) {
    return await this.userRepository.findOne({
      where: {
        userProvider: provider,
        userId: providerId,
      },
    });
  }

  async updateSocialInfo(userIdx: number, data: Partial<UserEntity>) {
    await this.userRepository.update({ userIdx }, data);
    return this.findOne(userIdx);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 프로필 이미지 변경 시 기존 이미지 삭제
    if (updateUserDto.userProfile) {
      const user = await this.findOne(id);
      const oldProfile = user?.userProfile;
      const newProfile = updateUserDto.userProfile;
      // 기본 이미지 또는 동일 이미지가 아닐 때만 삭제
      const isDefault = !oldProfile || oldProfile.includes('profile.png');
      if (oldProfile && !isDefault && oldProfile !== newProfile) {
        // 파일 경로에서 api/public/ 부분 제거
        const fileName = oldProfile.replace('https://walkee.duckdns.org/public/profile-images/', '');
        const filePath = path.join(
          __dirname,
          '../../public/profile-images',
          fileName,
        );
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('기존 프로필 이미지 삭제 실패:', err);
          }
        });
      }
    }
    await this.userRepository.update({ userIdx: id }, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ userIdx: id });
  }

  async getUserSummary(userIdx: number) {
    const userRoute = await this.routeRepository.find({ where: { userIdx } });
    const userRouteLike = await this.routeLikeRepository.find({
      where: { userIdx },
    });
    const userPost = await this.postRepository.find({ where: { userIdx } });
    const userFollows = await this.followRepository.find({
      where: { userIdx },
      order: { followCreatedAt: 'DESC' },
    });

    // userRouteLike에는 routeIdx만 있으므로, 실제 route 정보를 가져와야 함.
    const likedRouteDetails = await Promise.all(
      userRouteLike.map((like) =>
        this.routeRepository.findOne({ where: { routeIdx: like.routeIdx } }),
      ),
    );

    return {
      userRoute,
      userRouteLike: likedRouteDetails.filter((route) => route !== null), // null 제거
      userRouteLikeRaw: userRouteLike,
      userPost,
      userFollows,
    };
  }

  async getCommunityPosts(userIdx?: number) {
    try {
      // 1. posts + user 조인
      const posts = await this.postRepository.find({
        where: { postDeletedAt: IsNull() },
        order: { postCreatedAt: 'DESC' },
        relations: ['user'],
      });

      // 2. postIdx 목록 추출
      const postIdxs = posts.map((p) => p.postIdx);

      // 3. post_likes count group by postIdx
      const likeCountsRaw = await this.postRepository.manager.query(
        `SELECT post_idx as postIdx, COUNT(*) as likeCount FROM post_likes WHERE post_idx IN (${postIdxs.length ? postIdxs.join(',') : 0}) GROUP BY post_idx`,
      );
      const likeCountMap = new Map(
        (Array.isArray(likeCountsRaw) ? likeCountsRaw : []).map((row) => {
          const r = row as { postIdx: number; likeCount: number };
          return [Number(r.postIdx), Number(r.likeCount)];
        }),
      );

      // 4. 댓글 수 집계
      const commentCountsRaw = await this.postRepository.manager.query(
        `SELECT post_idx as postIdx, COUNT(*) as commentCount FROM comments WHERE post_idx IN (${postIdxs.length ? postIdxs.join(',') : 0}) AND comment_deleted_at IS NULL GROUP BY post_idx`,
      );
      const commentCountMap = new Map(
        (Array.isArray(commentCountsRaw) ? commentCountsRaw : []).map((row) => {
          const r = row as { postIdx: number; commentCount: number };
          return [Number(r.postIdx), Number(r.commentCount)];
        }),
      );

      // 5. user가 좋아요한 postIdx 목록
      let likedPostIdxSet = new Set();
      if (userIdx) {
        const likedRows = await this.postRepository.manager.query(
          `SELECT post_idx FROM post_likes WHERE user_idx = ? AND post_idx IN (${postIdxs.length ? postIdxs.join(',') : 0})`,
          [userIdx],
        );
        likedPostIdxSet = new Set(
          (Array.isArray(likedRows) ? likedRows : []).map((row) => {
            const r = row as { post_idx: number };
            return Number(r.post_idx);
          }),
        );
      }

      // 6. posts에 user, likeCount, commentCount, isLiked 포함해서 반환
      return posts.map((p) => ({
        ...p,
        userIdx: Number(p.userIdx),
        userName: p.user?.userName || '',
        userProfile: p.user?.userProfile || '',
        likeCount: likeCountMap.get(p.postIdx) || 0,
        commentCount: commentCountMap.get(p.postIdx) || 0,
        isLiked: userIdx ? likedPostIdxSet.has(p.postIdx) : false,
      }));
    } catch (e) {
      console.error('getCommunityPosts error:', e);
      return [];
    }
  }
}
