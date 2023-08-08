import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  courseId: number;

  @IsNotEmpty()
  courseName: string;

  @IsNotEmpty()
  courseLangue: number;

  @IsNotEmpty()
  target: string;

  @IsNotEmpty()
  about: string;
}
