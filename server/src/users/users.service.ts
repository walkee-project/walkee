import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { userIdx: id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { userEmail: email },
    });
  }

  async findByProviderAndId(provider: string, providerId: string) {
    return await this.userRepository.findOne({
      where: {
        userProvider: provider,
        userId: providerId,
      },
    });
  }

  async updateSocialInfo(userIdx: number, data: Partial<UserEntity>) {
    await this.userRepository.update({ userIdx }, data);
    return this.findOne(userIdx);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 프로필 이미지 변경 시 기존 이미지 삭제
    if (updateUserDto.userProfile) {
      const user = await this.findOne(id);
      const oldProfile = user?.userProfile;
      const newProfile = updateUserDto.userProfile;
      // 기본 이미지 또는 동일 이미지가 아닐 때만 삭제
      const isDefault = !oldProfile || oldProfile.includes('profile.png');
      if (oldProfile && !isDefault && oldProfile !== newProfile) {
        // 파일 경로에서 api/public/ 부분 제거
        const fileName = oldProfile.replace('api/public/profile-images/', '');
        const filePath = path.join(
          __dirname,
          '../../public/profile-images',
          fileName,
        );
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('기존 프로필 이미지 삭제 실패:', err);
          }
        });
      }
    }
    await this.userRepository.update({ userIdx: id }, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ userIdx: id });
  }
}
