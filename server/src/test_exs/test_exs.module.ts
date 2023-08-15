import { Module } from '@nestjs/common';
import { TestExsService } from './test_exs.service';
import { TestExsController } from './test_exs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEx } from './entities/test_ex.entity';
import { Test } from 'src/tests/entities/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestEx, Test])],
  controllers: [TestExsController],
  providers: [TestExsService],
})
export class TestExsModule {}
