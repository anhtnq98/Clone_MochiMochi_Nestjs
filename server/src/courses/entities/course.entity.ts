import { CreateCourseDto } from './../dto/create-course.dto';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryColumn()
  courseId: number;

  @Column()
  courseName: string;

  @Column()
  courseLangue: number;

  @Column()
  target: string;

  @Column()
  about: string;

  @OneToMany(() => Lesson, (lesson) => lesson.courseId)
  lessons: Lesson[];

  constructor(CreateCourseDto: Object = {}) {
    Object.assign(this, CreateCourseDto);
  }
}
