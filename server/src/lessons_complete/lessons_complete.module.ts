import { Module } from '@nestjs/common';
import { LessonsCompleteService } from './lessons_complete.service';
import { LessonsCompleteController } from './lessons_complete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsComplete } from './entities/lessons_complete.entity';
import { User } from 'src/users/entities/user.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonsComplete, User, Lesson])],
  controllers: [LessonsCompleteController],
  providers: [LessonsCompleteService],
})
export class LessonsCompleteModule {}
