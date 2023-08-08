import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonsCompleteService } from './lessons_complete.service';
import { CreateLessonsCompleteDto } from './dto/create-lessons_complete.dto';
import { UpdateLessonsCompleteDto } from './dto/update-lessons_complete.dto';

@Controller('lessons-complete')
export class LessonsCompleteController {
  constructor(private readonly lessonsCompleteService: LessonsCompleteService) {}

  @Post()
  create(@Body() createLessonsCompleteDto: CreateLessonsCompleteDto) {
    return this.lessonsCompleteService.create(createLessonsCompleteDto);
  }

  @Get()
  findAll() {
    return this.lessonsCompleteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsCompleteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonsCompleteDto: UpdateLessonsCompleteDto) {
    return this.lessonsCompleteService.update(+id, updateLessonsCompleteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsCompleteService.remove(+id);
  }
}
