import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto, res: Response) {
    try {
      let course = await this.courseRepo.findOne({
        where: { courseName: createCourseDto.courseName },
      });
      if (course) {
        return res.status(401).json({
          message: 'Khóa học này đã được thêm rồi!',
        });
      } else {
        let newCourse = new Course(createCourseDto);
        let addNewCourse = this.courseRepo.create(newCourse);
        await this.courseRepo.save(addNewCourse);
        return res.status(201).json({
          message: 'Thêm khóa học mới thành công!',
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
      return this.courseRepo.find({});
    } catch (error) {
      return `Không thể lấy thông tin khóa học do lỗi ${error}`;
    }
  }

  findOne(courseId: number) {
    try {
      return this.courseRepo.findOneBy({ courseId });
    } catch (error) {
      return `Không thể lấy thông tin khóa học do lỗi ${error}`;
    }
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
