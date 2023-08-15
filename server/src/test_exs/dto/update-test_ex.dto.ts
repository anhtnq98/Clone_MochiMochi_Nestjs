import { PartialType } from '@nestjs/mapped-types';
import { CreateTestExDto } from './create-test_ex.dto';

export class UpdateTestExDto extends PartialType(CreateTestExDto) {}
