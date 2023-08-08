import { Lesson } from 'src/lessons/entities/lesson.entity';
import {} from 'typeorm';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('new_words')
export class NewWord {
  @PrimaryColumn()
  newWordId: number;

  @Column()
  lessonId: number;

  @Column()
  title: string;

  @Column()
  contentOne: string;

  @Column()
  contentTwo: string;

  @Column()
  pronound: string;

  @Column()
  translate: string;

  @Column()
  newWordImg: string;

  @Column()
  voice: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.new_words, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson[];

  constructor(CreateNewWordDto: Object = {}) {
    Object.assign(this, CreateNewWordDto);
  }
}
