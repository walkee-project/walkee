import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';
import { DrawingEntity } from './entities/drawing.entity';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectRepository(DrawingEntity)
    private readonly userRepository: Repository<DrawingEntity>,
  ) {}

  async create(createDrawingDto: CreateDrawingDto) {
    const user = this.userRepository.create(createDrawingDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { drawingIdx: id } });
  }

  async update(id: number, updateDrawingDto: UpdateDrawingDto) {
    await this.userRepository.update({ drawingIdx: id }, updateDrawingDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ drawingIdx: id });
  }
}
