import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('comment_likes')
@Unique(['userIdx', 'commentIdx']) // 중복 좋아요 방지
export class CommentLikeEntity {
  @PrimaryGeneratedColumn({ name: 'like_idx' })
  likeIdx: number;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @Column({ name: 'comment_idx' })
  commentIdx: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
