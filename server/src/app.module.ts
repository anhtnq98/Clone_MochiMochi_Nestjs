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
import { NewWord } from './new_words/entities/new_word.entity';
import { LessonsCompleteModule } from './lessons_complete/lessons_complete.module';
import { LessonsComplete } from './lessons_complete/entities/lessons_complete.entity';
import { TestsModule } from './tests/tests.module';
import { TestExsModule } from './test_exs/test_exs.module';
import { TestTablesModule } from './test_tables/test_tables.module';
import { TestTable } from './test_tables/entities/test_table.entity';
import { Test } from './tests/entities/test.entity';
import { TestEx } from './test_exs/entities/test_ex.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'clone_mochi',
      entities: [User, Note, Course, Lesson, NewWord, LessonsComplete, TestTable, Test, TestEx],
      synchronize: true,
    }),
    UsersModule,
    NotesModule,
    AuthModule,
    CoursesModule,
    LessonsModule,
    NewWordsModule,
    LessonsCompleteModule,
    TestsModule,
    TestExsModule,
    TestTablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
