export class Follow {}
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('follows')
export class FollowEntity {
  @PrimaryGeneratedColumn({ name: 'follow_idx' })
  followIdx: number;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @Column({ name: 'route_idx' })
  routeIdx?: number;

  @Column({ name: 'follow_title' })
  followTitle?: string;

  @Column({ name: 'follow_totalKm' })
  followTotalKm: number;

  @Column({ name: 'follow_totalTime' })
  followTotalTime: number;

  @Column({ name: 'follow_polyline' })
  followPolyline: string;

  @Column({ name: 'follow_start_lat', type: 'double' })
  followStartLat: number;

  @Column({ name: 'follow_start_lng', type: 'double' })
  followStartLng: number;

  @Column({ name: 'follow_end_lat', type: 'double' })
  followEndLat: number;

  @Column({ name: 'follow_end_lng', type: 'double' })
  followEndLng: number;

  @Column({ name: 'follow_thumbnail' })
  followThumbnail?: string;

  @Column({ name: 'follow_completed' })
  followCompleted?: number;

  @CreateDateColumn({ name: 'follow_created_at' })
  followCreatedAt: Date;

  @Column({ name: 'follow_deleted_at' })
  followDeletedAt?: Date;
}
