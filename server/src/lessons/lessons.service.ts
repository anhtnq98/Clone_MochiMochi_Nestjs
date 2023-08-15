import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Response } from 'express';
import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { NewWord } from 'src/new_words/entities/new_word.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Course) readonly courseRepo: Repository<Course>,
    @InjectRepository(NewWord) readonly newWordRepo: Repository<NewWord>,
  ) {}

  async create(createLessonDto: CreateLessonDto, res: Response) {
    try {
      let lesson = await this.lessonRepo.findOne({
        where: { lessonName: createLessonDto.lessonName },
      });
      if (lesson) {
        return res.status(401).json({
          message: 'Bài học này đã được thêm rồi! ⚠️',
        });
      }

      let newLesson = new Lesson(createLessonDto);
      let addNewLesson = this.lessonRepo.create(newLesson);
      await this.lessonRepo.save(addNewLesson);
      return res.status(201).json({
        message: 'Thêm bài mới thành công! 🍀',
        course: newLesson,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Thêm bài mới thất bại! ',
        error: error,
      });
    }
  }

  async findAll() {
    try {
      return await this.lessonRepo.find({
        relations: ['new_words'],
      });
    } catch (error) {
      return `Không thể lấy thông tin bài học do lỗi ${error}`;
    }
  }

  async findAllByCourseId(courseId: number) {
    try {
      return await this.lessonRepo.find({
        // relations: ['new_words'],
        where: { courseId },
      });
    } catch (error) {
      return `Không thể lấy thông tin bài học do lỗi ${error}`;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} lesson`;
  }

  async update(lessonId: number, updateLessonDto: UpdateLessonDto) {
    try {
      const update = await this.lessonRepo.findOne({
        // relations: ['new_words'],
        where: { lessonId },
      });
      if (!update) {
        throw new NotFoundException('Khóa học này không tồn tại!');
      }

      return await this.lessonRepo.update(lessonId, {
        ...(updateLessonDto.courseId && {
          courseId: updateLessonDto.courseId,
        }),
        ...(updateLessonDto.lessonName && {
          lessonName: updateLessonDto.lessonName,
        }),
        ...(updateLessonDto.lessonSubName && {
          lessonSubName: updateLessonDto.lessonSubName,
        }),
        ...(updateLessonDto.lessonImg && {
          lessonImg: updateLessonDto.lessonImg,
        }),
      });
    } catch (error) {
      return `Không thể sửa nội dung bởi lỗi ${error}`;
    }
  }

  async remove(lessonId: number) {
    try {
      let lesson = await this.lessonRepo.find({ where: { lessonId } });
      return this.lessonRepo.remove(lesson);
    } catch (error) {
      return `Không thể xóa do lỗi ${error}`;
    }
  }
}
