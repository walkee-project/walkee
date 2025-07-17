import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteEntity } from './entities/route.entity';
import { In } from 'typeorm';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    console.log('서비스에서 받은 값:', createRouteDto);
    const route = this.routeRepository.create(createRouteDto);
    return await this.routeRepository.save(route);
  }

  async findAll() {
    return await this.routeRepository.find({
      where: { routeDeletedAt: IsNull() },
    });
  }

  async findOne(id: number) {
    return await this.routeRepository.findOne({
      where: { routeIdx: id, routeDeletedAt: IsNull() },
    });
  }

  async update(id: number, updateRouteDto: UpdateRouteDto) {
    await this.routeRepository.update({ routeIdx: id }, updateRouteDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.routeRepository.update(
      { routeIdx: id },
      {
        routeDeletedAt: new Date(),
      },
    );
  }

  async findByUser(userId: number) {
    return this.routeRepository.find({
      where: { userIdx: userId, routeDeletedAt: IsNull() },
      order: { routeCreatedAt: 'DESC' }, // 최신순 정렬
    });
  }

  async findRoutesByIds(routeIds: number[]) {
    return this.routeRepository.find({
      where: {
        routeIdx: In(routeIds),
        routeDeletedAt: IsNull(),
      },
    });
  }
}
