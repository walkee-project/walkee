import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('routes')
export class RouteEntity {
  @PrimaryGeneratedColumn({ name: 'route_idx' })
  routeIdx: number;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @Column({ name: 'route_title' })
  routeTitle: string;

  @Column({ name: 'route_totalKm' })
  routeTotalKm: number;

  @Column({ name: 'route_totalTime' })
  routeTotalTime: number;

  @Column({ name: 'route_polyline' })
  routePolyline: string;

  @Column({ name: 'route_start_lat', type: 'double' })
  routeStartLat: number;

  @Column({ name: 'route_start_lng', type: 'double' })
  routeStartLng: number;

  @Column({ name: 'route_end_lat', type: 'double' })
  routeEndLat: number;

  @Column({ name: 'route_end_lng', type: 'double' })
  routeEndLng: number;

  @Column({ name: 'route_run_count' })
  routeRunCount: number;

  @Column({ name: 'route_thumbnail' })
  routeThumbnail?: string;

  @Column({ name: 'route_difficulty' })
  routeDifficulty: string;

  @CreateDateColumn({ name: 'route_created_at' })
  routeCreatedAt: Date;

  @Column({ name: 'route_deleted_at' })
  routeDeletedAt?: Date;
}
