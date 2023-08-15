import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './entities/lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { NewWord } from 'src/new_words/entities/new_word.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Course, NewWord, User])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
