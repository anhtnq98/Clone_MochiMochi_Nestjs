import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { Note } from './notes/entities/note.entity';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { Course } from './courses/entities/course.entity';
import { Lesson } from './lessons/entities/lesson.entity';
import { NewWordsModule } from './new_words/new_words.module';
import { LessonsCompleteModule } from './lessons_complete/lessons_complete.module';
import { NewWord } from './new_words/entities/new_word.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'clone_mochi',
      entities: [User, Note, Course, Lesson, NewWord],
      synchronize: true,
    }),
    UsersModule,
    NotesModule,
    AuthModule,
    CoursesModule,
    LessonsModule,
    NewWordsModule,
    LessonsCompleteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
