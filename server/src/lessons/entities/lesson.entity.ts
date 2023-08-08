import { Course } from 'src/courses/entities/course.entity';
import { NewWord } from 'src/new_words/entities/new_word.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('lessons')
export class Lesson {
  @PrimaryColumn()
  lessonId: number;

  @Column()
  courseId: number;

  @Column()
  lessonName: string;

  @Column()
  lessonSubName: string;

  @Column()
  lessonImg: string;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course[];

  @OneToMany(() => NewWord, (new_word) => new_word.lessonId)
  new_words: NewWord[];

  constructor(CreateLessonDto: Object = {}) {
    Object.assign(this, CreateLessonDto);
  }
}
