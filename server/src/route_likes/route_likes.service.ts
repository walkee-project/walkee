import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRouteLikeDto } from './dto/create-route_like.dto';
import { RouteLikeEntity } from './entities/route_like.entity';

@Injectable()
export class RouteLikesService {
  constructor(
    @InjectRepository(RouteLikeEntity)
    private readonly routeLikeRepository: Repository<RouteLikeEntity>,
  ) {}

  async create(createRouteLikeDto: CreateRouteLikeDto) {
    const routeLike = this.routeLikeRepository.create(createRouteLikeDto);
    return await this.routeLikeRepository.save(routeLike);
  }

  async findAll() {
    return await this.routeLikeRepository.find();
  }

  async findOne(id: number) {
    return await this.routeLikeRepository.findOne({
      where: { likeIdx: id },
    });
  }

  async remove(id: number) {
    return await this.routeLikeRepository.delete({ likeIdx: id });
  }

  async findByUser(userId: number) {
    return this.routeLikeRepository.find({
      where: { userIdx: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async removeByUserAndRoute(userIdx: number, routeIdx: number) {
    return await this.routeLikeRepository.delete({ userIdx, routeIdx });
  }

  async isRouteLiked(userIdx: number, routeIdx: number): Promise<boolean> {
    const like = await this.routeLikeRepository.findOne({
      where: { userIdx, routeIdx },
    });
    return !!like;
  }
}
