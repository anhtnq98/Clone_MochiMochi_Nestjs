import { PartialType } from '@nestjs/mapped-types';
import { CreateTestTableDto } from './create-test_table.dto';

export class UpdateTestTableDto extends PartialType(CreateTestTableDto) {}
