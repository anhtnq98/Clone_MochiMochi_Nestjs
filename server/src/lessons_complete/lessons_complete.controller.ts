import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonsCompleteService } from './lessons_complete.service';
import { CreateLessonsCompleteDto } from './dto/create-lessons_complete.dto';
import { UpdateLessonsCompleteDto } from './dto/update-lessons_complete.dto';

@Controller('/api/v1/lessons_complete')
export class LessonsCompleteController {
  constructor(
    private readonly lessonsCompleteService: LessonsCompleteService,
  ) {}

  @Post()
  create(@Body() createLessonsCompleteDto: CreateLessonsCompleteDto) {
    return this.lessonsCompleteService.create(createLessonsCompleteDto);
  }

  @Get()
  findAllComplete() {
    return this.lessonsCompleteService.findAllComplete();
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.lessonsCompleteService.findAll(userId);
  }

  
}
