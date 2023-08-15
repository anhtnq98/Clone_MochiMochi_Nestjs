import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { TestTable } from 'src/test_tables/entities/test_table.entity';
import { TestEx } from 'src/test_exs/entities/test_ex.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Test, TestTable, TestEx])],
  controllers: [TestsController],
  providers: [TestsService]
})
export class TestsModule {}
