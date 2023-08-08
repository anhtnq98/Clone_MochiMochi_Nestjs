import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateNewWordDto {
  @IsNotEmpty()
  newWordId: number;

  @IsNotEmpty()
  lessonId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  contentOne: string;

  @MinLength(0)
  contentTwo: string | null;

  @IsNotEmpty()
  pronound: string;

  @IsNotEmpty()
  translate: string;

  @IsNotEmpty()
  newWordImg: string;

  @IsNotEmpty()
  voice: string;
}
