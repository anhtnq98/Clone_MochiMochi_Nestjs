import { Lesson } from 'src/lessons/entities/lesson.entity';
import {} from 'typeorm';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('new_words')
export class NewWord {
  @PrimaryColumn()
  newWordId: number;

  @Column()
  title: string;

  @Column()
  contentOne: string;

  @Column({ nullable: true })
  contentTwo: string;

  @Column()
  pronound: string;

  @Column()
  translate: string;

  @Column('longtext')
  newWordImg: string;

  @Column('longtext')
  voice: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.new_words, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId' })
  @Column()
  lessonId: number;

  constructor(CreateNewWordDto: Object = {}) {
    Object.assign(this, CreateNewWordDto);
  }
}
