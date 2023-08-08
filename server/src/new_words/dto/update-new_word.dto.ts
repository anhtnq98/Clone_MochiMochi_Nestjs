import { PartialType } from '@nestjs/mapped-types';
import { CreateNewWordDto } from './create-new_word.dto';

export class UpdateNewWordDto extends PartialType(CreateNewWordDto) {}
