import { IsNotEmpty } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  lessonId: number;

  @IsNotEmpty()
  courseId: number;

  @IsNotEmpty()
  lessonName: string;

  @IsNotEmpty()
  lessonSubName: string;

  @IsNotEmpty()
  lessonImg: string;
}
