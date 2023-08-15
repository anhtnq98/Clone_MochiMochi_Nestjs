import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Response } from 'express';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Lesson) readonly lessonRepo: Repository<Lesson>,
  ) {}

  async create(createCourseDto: CreateCourseDto, res: Response) {
    try {
      let course = await this.courseRepo.findOne({
        relations: ['lessons', 'lessons.new_words'],
        where: {
          courseName: createCourseDto.courseName,
        },
      });
      if (course) {
        return res.status(401).json({
          message: 'Khóa học này đã được thêm rồi! ⚠️',
        });
      } else {
        let newCourse = new Course(createCourseDto);
        let addNewCourse = this.courseRepo.create(newCourse);
        await this.courseRepo.save(addNewCourse);
        return res.status(201).json({
          message: 'Thêm khóa học mới thành công 🍀!',
          course: newCourse,
        });
      }
    } catch (error) {
      return res.status(401).json({
        message: 'Không thể thêm khóa học mới!',
        error: error,
      });
    }
  }

  findAll() {
    try {
      return this.courseRepo.find({
        relations: ['lessons', 'lessons.new_words'],
      });
    } catch (error) {
      throw new Error(`Không thể lấy thông tin khóa học do lỗi ${error}`);
    }
  }

  async searchCourse(searchCV: string) {
    try {
      return await this.courseRepo.find({
        relations: ['lessons', 'lessons.new_words'],
        where: {
          courseName: Like(`%${searchCV}%`),
        },
      });
    } catch (error) {
      throw new Error(`Không thể lấy thông tin khóa học do lỗi ${error}`);
    }
  }

  async findOne(courseId: number) {
    try {
      return await this.courseRepo.findOne({
        relations: ['lessons', 'lessons.new_words'],
        where: { courseId },
      });
    } catch (error) {
      return `Không thể lấy thông tin khóa học do lỗi ${error}`;
    }
  }

  async update(courseId: number, updateCourseDto: UpdateCourseDto) {
    try {
      const update = await this.courseRepo.findOne({
        relations: ['lessons', 'lessons.new_words'],
        where: { courseId },
      });
      if (!update) {
        throw new NotFoundException('Khóa học này không tồn tại!');
      }

      return await this.courseRepo.update(courseId, {
        ...(updateCourseDto.courseName && {
          courseName: updateCourseDto.courseName,
        }),
        ...(updateCourseDto.courseLangue && {
          courseLangue: updateCourseDto.courseLangue,
        }),
        ...(updateCourseDto.target && { target: updateCourseDto.target }),
        ...(updateCourseDto.about && { about: updateCourseDto.about }),
      });
    } catch (error) {
      return `Không thể sửa nội dung bởi lỗi ${error}`;
    }
  }

  async remove(courseId: number) {
    try {
      let course = await this.courseRepo.findOne({
        relations: ['lessons', 'lessons.new_words'],
        where: { courseId },
      });
      return this.courseRepo.remove(course);
    } catch (error) {
      return `Không thể xóa do lỗi ${error}`;
    }
  }
}
