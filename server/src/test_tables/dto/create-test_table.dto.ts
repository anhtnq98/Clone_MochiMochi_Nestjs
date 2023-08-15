import { IsNotEmpty } from 'class-validator';

export class CreateTestTableDto {
  @IsNotEmpty()
  testTableId: number;

  @IsNotEmpty()
  testTableName: string;

  @IsNotEmpty()
  testTableType: number;
}
