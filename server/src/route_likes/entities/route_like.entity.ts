import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('route_likes')
@Unique(['userIdx', 'routeIdx']) // 중복 좋아요 방지
export class RouteLikeEntity {
  @PrimaryGeneratedColumn({ name: 'like_idx' })
  likeIdx: number;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @Column({ name: 'route_idx' })
  routeIdx: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
