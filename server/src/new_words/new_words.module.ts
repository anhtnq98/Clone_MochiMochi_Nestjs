import { Module } from '@nestjs/common';
import { NewWordsService } from './new_words.service';
import { NewWordsController } from './new_words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewWord } from './entities/new_word.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewWord, Lesson])],
  controllers: [NewWordsController],
  providers: [NewWordsService]
})
export class NewWordsModule {}
