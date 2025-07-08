// src/users/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_idx' })
  userIdx: number;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'user_provider',
  })
  userProvider: string;

  @Column({
    name: 'user_email',
  })
  userEmail: string;

  @Column({
    name: 'user_name',
  })
  userName: string;

  @Column({
    name: 'user_profile',
  })
  userProfile?: string;

  @Column({
    name: 'user_point',
    default: 0,
  })
  userPoint: number;

  @CreateDateColumn({
    name: 'user_created_at',
  })
  userCreatedAt: Date;
}
