import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn({ name: 'comment_idx' })
  commentIdx: number;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @Column({ name: 'post_idx' })
  postIdx: number;

  @Column({ name: 'comment_content' })
  commentContent: string;

  @Column({ name: 'comment_parent_id' })
  commentParentId: number;

  @CreateDateColumn({ name: 'comment_created_at' })
  commentCreatedAt: Date;

  @Column({ name: 'comment_deleted_at' })
  commentDeletedAt?: Date;
}
