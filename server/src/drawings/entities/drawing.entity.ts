import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('drawings')
export class DrawingEntity {
  @PrimaryGeneratedColumn({ name: 'drawing_idx' })
  drawingIdx: number;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'drawing_title',
  })
  drawingTitle: string;

  @Column({
    name: 'drawing_description',
  })
  drawingDescription?: string;

  @Column({
    name: 'drawing_thumbnail',
  })
  drawingThumbnail?: string;

  @CreateDateColumn({
    name: 'drawing_created_at',
  })
  drawingCreatedAt: Date;

  @Column({
    name: 'drawing_deleted_at',
  })
  drawingDeletedAt: Date;
}
