import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn({ name: 'post_idx' })
  postIdx: number;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_idx' })
  user: UserEntity;

  @Column({ name: 'post_title' })
  postTitle: string;

  @Column({ name: 'post_content' })
  postContent: string;

  @Column({ name: 'post_uploadImg' })
  postUploadImg?: string;

  @Column({ name: 'post_location' })
  postLocation?: string;

  @Column({ name: 'post_count' })
  postCount: number;

  @CreateDateColumn({ name: 'post_created_at' })
  postCreatedAt: Date;

  @Column({ name: 'post_deleted_at' })
  postDeletedAt?: Date;
}
