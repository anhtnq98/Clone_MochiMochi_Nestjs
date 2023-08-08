import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Response } from 'express';
import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto, res: Response) {
    try {
      let lesson = await this.lessonRepo.findOne({
        where: { lessonName: createLessonDto.lessonName },
      });
      if (lesson) {
        return res.status(401).json({
          message: 'Bài học này đã được thêm rồi!',
        });
      }
      let newLesson = new Lesson(createLessonDto);
      let addNewLesson = this.lessonRepo.create(newLesson);
      await this.lessonRepo.save(addNewLesson);
      return res.status(201).json({
        message: 'Thêm bài mới thành công!',
        course: newLesson,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Thêm bài mới thất bại!',
        error: error,
      });
    }
  }

  async findAll(courseId: number) {
    try {
      return await this.lessonRepo.find({ where: { courseId } });
    } catch (error) {
      return `Không thể lấy thông tin bài học do lỗi ${error}`;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} lesson`;
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} lesson`;
  }
}
