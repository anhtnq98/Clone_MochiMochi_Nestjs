import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonsCompleteDto } from './create-lessons_complete.dto';

export class UpdateLessonsCompleteDto extends PartialType(CreateLessonsCompleteDto) {}
