import { Module } from '@nestjs/common';
import { LessonsCompleteService } from './lessons_complete.service';
import { LessonsCompleteController } from './lessons_complete.controller';

@Module({
  controllers: [LessonsCompleteController],
  providers: [LessonsCompleteService]
})
export class LessonsCompleteModule {}
