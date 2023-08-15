import { Lesson } from 'src/lessons/entities/lesson.entity';
import { LessonsComplete } from 'src/lessons_complete/entities/lessons_complete.entity';
import { Note } from 'src/notes/entities/note.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn()
  userId: string = uuidv4();

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  experience: number;

  @Column()
  trophy: string;

  @Column()
  role: number;

  @Column()
  photoURL: string;

  @OneToMany(() => Note, (note) => note.userId)
  notes: Note[];

  @OneToMany(
    () => LessonsComplete,
    (lessons_complete) => lessons_complete.userId,
  )
  lessons_complete: LessonsComplete[];

  // @ManyToMany(() => Lesson, (lesson) => lesson.users)
  // @JoinTable({
  //   name: 'lessons_complete',
  //   joinColumn: { name: 'userId', referencedColumnName: 'userId' },
  //   inverseJoinColumn: {
  //     name: 'lessonId',
  //     referencedColumnName: 'lessonId',
  //   },
  // })
  // lessons: Lesson[];
}
