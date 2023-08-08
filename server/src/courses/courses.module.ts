import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Lesson])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
