import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('lessons_complete')
export class LessonsComplete {
  @PrimaryGeneratedColumn()
  completeId: number;

  @Column()
  lessonId: number;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.lessons_complete, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.lessons_complete, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId', referencedColumnName: 'lessonId' })
  lesson: Lesson;

  constructor(CreateLessonsCompleteDto: Object = {}) {
    Object.assign(this, CreateLessonsCompleteDto);
  }
}
