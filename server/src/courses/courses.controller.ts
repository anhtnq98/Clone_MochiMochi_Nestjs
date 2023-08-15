import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Response } from 'express';

@Controller('/api/v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Res() res: Response) {
    return this.coursesService.create(createCourseDto, res);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('/search')
  async searchCourse(@Query('searchCV') searchCV: string) {
    return await this.coursesService.searchCourse(searchCV);
  }

  @Get(':courseId')
  async findOne(@Param('courseId') courseId: string) {
    return await this.coursesService.findOne(+courseId);
  }

  @Patch(':courseId')
  async update(@Param('courseId') courseId: string, @Body() updateCourseDto: UpdateCourseDto) {
    return await this.coursesService.update(+courseId, updateCourseDto);
  }

  @Delete(':courseId')
  async remove(@Param('courseId') courseId: string) {
    return await this.coursesService.remove(+courseId);
  }
}
