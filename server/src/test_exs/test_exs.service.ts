import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestExDto } from './dto/create-test_ex.dto';
import { UpdateTestExDto } from './dto/update-test_ex.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestEx } from './entities/test_ex.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class TestExsService {
  constructor(
    @InjectRepository(TestEx) private testExRepo: Repository<TestEx>,
  ) {}

  async create(createTestExDto: CreateTestExDto, res: Response) {
    try {
      let testEx = await this.testExRepo.findOne({
        where: { question: createTestExDto.question },
      });
      if (testEx) {
        return res.status(401).json({
          message: 'Câu hỏi này đã được thêm rồi! ⚠️',
        });
      }

      if (
        createTestExDto.answerOne === createTestExDto.rightAnswer ||
        createTestExDto.answerTwo === createTestExDto.rightAnswer ||
        createTestExDto.answerThree === createTestExDto.rightAnswer ||
        createTestExDto.answerFour === createTestExDto.rightAnswer
      ) {
        let newTestEx = new TestEx(createTestExDto);
        let addNewTestEx = this.testExRepo.create(newTestEx);
        await this.testExRepo.save(addNewTestEx);
        return res.status(201).json({
          message: 'Thêm câu hỏi thành công! 🍀',
          testEx: newTestEx,
        });
      } else {
        return res.status(401).json({
          message: 'Phải có một câu trả lời đúng! ⚠️',
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: 'Thêm câu hỏi thất bại! ⚠️',
        error: error,
      });
    }
  }

  async findAllEx() {
    try {
      return await this.testExRepo.find({});
    } catch (error) {
      return `Không thể lấy thông tin từ mới do lỗi ${error}`;
    }
  }

  async findAll(testId: number) {
    try {
      return await this.testExRepo.find({ where: { testId } });
    } catch (error) {
      return `Không thể lấy thông tin từ mới do lỗi ${error}`;
    }
  }

  async update(exId: number, updateTestExDto: UpdateTestExDto, res: Response) {
    try {
      const update = await this.testExRepo.findOneBy({ exId });
      if (!update) {
        return res.status(404).json({
          message: 'Bài test này không tồn tại! ⚠️',
        });
      }

      if (
        updateTestExDto.answerOne === updateTestExDto.rightAnswer ||
        updateTestExDto.answerTwo === updateTestExDto.rightAnswer ||
        updateTestExDto.answerThree === updateTestExDto.rightAnswer ||
        updateTestExDto.answerFour === updateTestExDto.rightAnswer
      ) {
        await this.testExRepo.update(exId, {
          ...(updateTestExDto.question && {
            question: updateTestExDto.question,
          }),
          ...(updateTestExDto.answerOne && {
            answerOne: updateTestExDto.answerOne,
          }),
          ...(updateTestExDto.answerTwo && {
            answerTwo: updateTestExDto.answerTwo,
          }),
          ...(updateTestExDto.answerThree && {
            answerThree: updateTestExDto.answerThree,
          }),
          ...(updateTestExDto.answerFour && {
            answerFour: updateTestExDto.answerFour,
          }),
          ...(updateTestExDto.rightAnswer && {
            rightAnswer: updateTestExDto.rightAnswer,
          }),
        });

        return res.status(200).json({
          message: 'Sửa câu hỏi thành công! 🍀',
        });
      } else {
        return res.status(400).json({
          message: 'Phải có một câu trả lời đúng! ⚠️',
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: 'Sửa câu hỏi thất bại! ⚠️',
        error: error,
      });
    }
  }

  async remove(exId: number) {
    try {
      let test = await this.testExRepo.find({ where: { exId } });
      return this.testExRepo.remove(test);
    } catch (error) {
      return `Không thể xóa do lỗi ${error}`;
    }
  }
}
