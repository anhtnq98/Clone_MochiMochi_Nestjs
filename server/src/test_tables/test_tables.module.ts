import { Module } from '@nestjs/common';
import { TestTablesService } from './test_tables.service';
import { TestTablesController } from './test_tables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestTable } from './entities/test_table.entity';
import { Test } from 'src/tests/entities/test.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TestTable, Test])],
  controllers: [TestTablesController],
  providers: [TestTablesService]
})
export class TestTablesModule {}
