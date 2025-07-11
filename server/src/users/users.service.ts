import { Injectable } from '@nestjs/common';
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
    await this.userRepository.update({ userIdx: id }, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ userIdx: id });
  }
}
