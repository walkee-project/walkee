import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('post_likes')
@Unique(['userIdx', 'postIdx']) // user_idx + post_idx 중복 방지
export class PostLikeEntity {
  @PrimaryGeneratedColumn({ name: 'like_idx' })
  likeIdx: number;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @Column({ name: 'post_idx' })
  postIdx: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
