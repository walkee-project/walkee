import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { FollowEntity } from './entities/follow.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async create(createFollowDto: CreateFollowDto) {
    const follow = this.followRepository.create(createFollowDto);
    return await this.followRepository.save(follow);
  }

  async findAll() {
    return await this.followRepository.find({
      where: { followDeletedAt: IsNull() },
    });
  }

  async findOne(id: number) {
    return await this.followRepository.findOne({
      where: { followIdx: id, followDeletedAt: IsNull() },
    });
  }

  async update(id: number, updateFollowDto: UpdateFollowDto) {
    await this.followRepository.update({ followIdx: id }, updateFollowDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.followRepository.update(
      { followIdx: id },
      {
        followDeletedAt: new Date(),
      },
    );
  }
}
