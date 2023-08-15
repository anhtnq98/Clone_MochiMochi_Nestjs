import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestTableDto } from './dto/create-test_table.dto';
import { UpdateTestTableDto } from './dto/update-test_table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestTable } from './entities/test_table.entity';
import { Like, Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class TestTablesService {
  constructor(
    @InjectRepository(TestTable) private testTableRepo: Repository<TestTable>,
  ) {}

  async create(createTestTableDto: CreateTestTableDto, res: Response) {
    try {
      let testTable = await this.testTableRepo.findOne({
        where: { testTableName: createTestTableDto.testTableName },
      });
      if (testTable) {
        return res.status(401).json({
          message: 'Chủ đế này đã được thêm rồi! ⚠️',
        });
      }

      let newTestTable = new TestTable(createTestTableDto);
      let addNewTestTable = this.testTableRepo.create(newTestTable);
      await this.testTableRepo.save(addNewTestTable);
      return res.status(201).json({
        message: 'Thêm chủ đề mới thành công! 🍀',
        testTable: newTestTable,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Thêm chủ đề mới thất bại! ',
        error: error,
      });
    }
  }

  async findAll() {
    try {
      return await this.testTableRepo.find({});
    } catch (error) {
      return `Không thể lấy thông tin do lỗi ${error}`;
    }
  }

  async searchTestTable(searchValue: string) {
    try {
      return await this.testTableRepo.find({
        where: {
          testTableName: Like(`%${searchValue}%`),
        },
      });
    } catch (error) {
      throw new Error(`Không thể lấy thông tin chủ đề do lỗi ${error}`);
    }
  }

  async findAllTestTables(testTableType: number) {
    try {
      return await this.testTableRepo.find({ where: { testTableType } });
    } catch (error) {
      return `Không thể lấy thông tin do lỗi ${error}`;
    }
  }

  async update(testTableId: number, updateTestTableDto: UpdateTestTableDto) {
    try {
      const update = await this.testTableRepo.findOneBy({ testTableId });
      if (!update) {
        throw new NotFoundException('Chủ đề test này không tồn tại!');
      }

      return await this.testTableRepo.update(testTableId, {
        ...(updateTestTableDto.testTableName && {
          testTableName: updateTestTableDto.testTableName,
        }),
        ...(updateTestTableDto.testTableType && {
          testTableType: updateTestTableDto.testTableType,
        }),
      });
    } catch (error) {
      return `Không thể sửa nội dung bởi lỗi ${error}`;
    }
  }

  async remove(testTableId: number) {
    try {
      let testTable = await this.testTableRepo.find({ where: { testTableId } });
      return this.testTableRepo.remove(testTable);
    } catch (error) {
      return `Không thể xóa do lỗi ${error}`;
    }
  }
}
