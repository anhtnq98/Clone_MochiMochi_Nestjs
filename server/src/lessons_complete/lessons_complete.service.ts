import { Injectable } from '@nestjs/common';
import { CreateLessonsCompleteDto } from './dto/create-lessons_complete.dto';
import { UpdateLessonsCompleteDto } from './dto/update-lessons_complete.dto';
import { LessonsComplete } from './entities/lessons_complete.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LessonsCompleteService {
  constructor(
    @InjectRepository(LessonsComplete)
    private lessonsCompleteRepo: Repository<LessonsComplete>,
  ) {}

  async create(createLessonsCompleteDto: CreateLessonsCompleteDto) {
    try {
      let lesson = await this.lessonsCompleteRepo.findOne({
        where: {
          lessonId: createLessonsCompleteDto.lessonId,
          userId: createLessonsCompleteDto.userId,
        },
      });
      if (lesson) {
        return 'Bài học này đã được thêm rồi!';
      }

      let newComplete = new LessonsComplete(createLessonsCompleteDto);
      let addNewComplete = this.lessonsCompleteRepo.create(newComplete);
      return await this.lessonsCompleteRepo.save(addNewComplete);
    } catch (error) {
      return `Không thể thêm dữ liệu bởi lỗi ${error}`;
    }
  }

  async findAllComplete() {
    try {
      return await this.lessonsCompleteRepo.find({});
    } catch (error) {
      return `Không thể lấy thông tin do lỗi ${error}`;
    }
  }

  async findAll(userId: string) {
    try {
      return await this.lessonsCompleteRepo.find({ where: { userId } });
    } catch (error) {
      return `Không thể lấy thông tin do lỗi ${error}`;
    }
  }
}
