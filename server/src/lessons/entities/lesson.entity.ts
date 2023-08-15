import { Course } from 'src/courses/entities/course.entity';
import { LessonsComplete } from 'src/lessons_complete/entities/lessons_complete.entity';
import { NewWord } from 'src/new_words/entities/new_word.entity';
import { User } from 'src/users/entities/user.entity';
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
  lessonName: string;

  @Column()
  lessonSubName: string;

  @Column('longtext')
  lessonImg: string;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  @Column()
  courseId: number;

  @OneToMany(() => NewWord, (new_words) => new_words.lessonId)
  new_words: NewWord[];

  @OneToMany(
    () => LessonsComplete,
    (lessons_complete) => lessons_complete.lessonId,
  )
  lessons_complete: LessonsComplete[];

  constructor(CreateLessonDto: Object = {}) {
    Object.assign(this, CreateLessonDto);
  }
}
