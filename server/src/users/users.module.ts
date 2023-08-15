import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { LessonsComplete } from 'src/lessons_complete/entities/lessons_complete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note, Lesson, LessonsComplete])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
