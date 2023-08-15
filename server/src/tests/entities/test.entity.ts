import { TestEx } from 'src/test_exs/entities/test_ex.entity';
import { TestTable } from 'src/test_tables/entities/test_table.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('tests')
export class Test {
  @PrimaryColumn()
  testId: number;

  @Column()
  testName: string;

  @Column({ nullable: true, type: 'longtext' })
  testEssay: string;

  @Column()
  testTableId: number;

  @ManyToOne(() => TestTable, (test_table) => test_table.tests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testTableId' })
  test_table: TestTable;

  @OneToMany(() => TestEx, (test_ex) => test_ex.testId)
  test_exs: TestEx[];

  constructor(CreateTestDto: Object = {}) {
    Object.assign(this, CreateTestDto);
  }
}
