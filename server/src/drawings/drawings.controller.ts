import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DrawingsService } from './drawings.service';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';

@Controller('drawings')
export class DrawingsController {
  constructor(private readonly drawingsService: DrawingsService) {}

  @Post()
  create(@Body() createDrawingDto: CreateDrawingDto) {
    return this.drawingsService.create(createDrawingDto);
  }

  @Get()
  findAll() {
    return this.drawingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drawingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDrawingDto: UpdateDrawingDto) {
    return this.drawingsService.update(+id, updateDrawingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.drawingsService.remove(+id);
  }
}
