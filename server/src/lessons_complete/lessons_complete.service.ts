import { Injectable } from '@nestjs/common';
import { CreateLessonsCompleteDto } from './dto/create-lessons_complete.dto';
import { UpdateLessonsCompleteDto } from './dto/update-lessons_complete.dto';

@Injectable()
export class LessonsCompleteService {
  create(createLessonsCompleteDto: CreateLessonsCompleteDto) {
    return 'This action adds a new lessonsComplete';
  }

  findAll() {
    return `This action returns all lessonsComplete`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonsComplete`;
  }

  update(id: number, updateLessonsCompleteDto: UpdateLessonsCompleteDto) {
    return `This action updates a #${id} lessonsComplete`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonsComplete`;
  }
}
