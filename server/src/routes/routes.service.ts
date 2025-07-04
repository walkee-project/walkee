import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteEntity } from './entities/route.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
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
}
