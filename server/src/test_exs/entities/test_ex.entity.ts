import { Test } from 'src/tests/entities/test.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('test_exs')
export class TestEx {
  @PrimaryColumn()
  exId: number;

  @Column()
  question: string;

  @Column()
  answerOne: string;

  @Column()
  answerTwo: string;

  @Column()
  answerThree: string;

  @Column({ nullable: true })
  answerFour: string;

  @Column()
  rightAnswer: string;

  @Column()
  testId: number;

  @ManyToOne(() => Test, (test_ex) => test_ex.testId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testId' })
  test: Test;

  constructor(CreateTestExDto: Object = {}) {
    Object.assign(this, CreateTestExDto);
  }
}
