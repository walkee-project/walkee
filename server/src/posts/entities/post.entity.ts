import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn({ name: 'post_idx' })
  postIdx: number;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @Column({ name: 'post_title' })
  postTitle: string;

  @Column({ name: 'post_content' })
  postContent: string;

  @Column({ name: 'post_uploadImg' })
  postUploadImg?: string;

  @CreateDateColumn({ name: 'post_created_at' })
  postCreatedAt: Date;

  @Column({ name: 'post_deleted_at' })
  postDeletedAt?: Date;
}
