import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateTestExDto {
  @IsNotEmpty()
  exId: number;

  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  answerOne: string;

  @IsNotEmpty()
  answerTwo: string;

  @IsNotEmpty()
  answerThree: string;

  @MinLength(0)
  answerFour: string | null;

  @IsNotEmpty()
  rightAnswer: string;

  @IsNotEmpty()
  testId: number;
}
