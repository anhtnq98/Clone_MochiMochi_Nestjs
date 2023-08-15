import { IsNotEmpty } from 'class-validator';

export class CreateLessonsCompleteDto {
  @IsNotEmpty()
  lessonId: number;

  @IsNotEmpty()
  userId: string;
}
