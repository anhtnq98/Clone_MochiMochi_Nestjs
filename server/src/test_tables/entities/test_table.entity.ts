import { Test } from 'src/tests/entities/test.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('test_tables')
export class TestTable {
  @PrimaryColumn()
  testTableId: number;

  @Column()
  testTableName: string;

  @Column()
  testTableType: number;

  @OneToMany(() => Test, (test) => test.testTableId)
  tests: Test[];

  constructor(CreateTestTableDto: Object = {}) {
    Object.assign(this, CreateTestTableDto);
  }
}
