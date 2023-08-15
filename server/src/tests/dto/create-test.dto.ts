import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty()
  testId: number;

  @IsNotEmpty()
  testName: string;

  @IsString()
  testEssay: string;

  @IsNotEmpty()
  testTableId: number;
}
