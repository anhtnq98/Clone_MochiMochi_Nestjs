import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './entities/test.entity';
import { Response } from 'express';

@Injectable()
export class TestsService {
  constructor(@InjectRepository(Test) private testRepo: Repository<Test>) {}

  async create(createTestDto: CreateTestDto, res: Response) {
    try {
      let test = await this.testRepo.findOne({
        where: { testName: createTestDto.testName },
      });
      if (test) {
        return res.status(401).json({
          message: 'Chủ đế này đã được thêm rồi! ⚠️',
        });
      }

      let newTest = new Test(createTestDto);
      let addNewTest = this.testRepo.create(newTest);
      await this.testRepo.save(addNewTest);
      return res.status(201).json({
        message: 'Thêm bài kiểm tra thành công! 🍀',
        test: newTest,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Thêm bài kiểm tra thất bại! ',
        error: error,
      });
    }
  }

  async findAll() {
    try {
      return await this.testRepo.find({});
    } catch (error) {
      return `Không thể lấy thông tin do lỗi ${error}`;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  async update(testId: number, updateTestDto: UpdateTestDto) {
    try {
      const update = await this.testRepo.findOneBy({ testId });
      if (!update) {
        throw new NotFoundException('Bài test này không tồn tại!');
      }

      return await this.testRepo.update(testId, {
        ...(updateTestDto.testName && {
          testName: updateTestDto.testName,
        }),
        ...(updateTestDto.testEssay && {
          testEssay: updateTestDto.testEssay,
        }),
      });
    } catch (error) {
      return `Không thể sửa nội dung bởi lỗi ${error}`;
    }
  }

  async remove(testId: number) {
    try {
      let test = await this.testRepo.find({ where: { testId } });
      return this.testRepo.remove(test);
    } catch (error) {
      return `Không thể xóa do lỗi ${error}`;
    }
  }
}
