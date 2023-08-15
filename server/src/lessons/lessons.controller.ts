import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Response } from 'express';

@Controller('/api/v1/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() createLessonDto: CreateLessonDto, @Res() res: Response) {
    return this.lessonsService.create(createLessonDto, res);
  }

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':courseId')
  findAllByCourseId(@Param('courseId') courseId: string) {
    return this.lessonsService.findAllByCourseId(+courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(+id);
  }

  @Patch(':lessonId')
  update(@Param('lessonId') lessonId: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(+lessonId, updateLessonDto);
  }

  @Delete(':lessonId')
  remove(@Param('lessonId') lessonId: string) {
    return this.lessonsService.remove(+lessonId);
  }
}
