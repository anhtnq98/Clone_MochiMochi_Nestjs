import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewWordDto } from './dto/create-new_word.dto';
import { UpdateNewWordDto } from './dto/update-new_word.dto';
import { Response } from 'express';
import { NewWord } from './entities/new_word.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Injectable()
export class NewWordsService {
  constructor(
    @InjectRepository(NewWord) private newWordRepo: Repository<NewWord>,
    @InjectRepository(Lesson) readonly lessonRepo: Repository<Lesson>,
  ) {}

  async create(createNewWordDto: CreateNewWordDto, res: Response) {
    try {
      let newWord = await this.newWordRepo.findOne({
        where: { title: createNewWordDto.title },
      });
      if (newWord) {
        return res.status(401).json({
          message: 'Từ mới này đã được thêm rồi! ⚠️',
        });
      }
      let newNewWord = new NewWord(createNewWordDto);
      let addNewWord = this.newWordRepo.create(newNewWord);
      await this.newWordRepo.save(addNewWord);
      return res.status(201).json({
        message: 'Thêm từ mới thành công! 🍀',
        new_word: newNewWord,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Không thể thêm từ mới',
        error: error,
      });
    }
  }

  async findAll() {
    try {
      return await this.newWordRepo.find({});
    } catch (error) {
      return `Không thể lấy thông tin từ mới do lỗi ${error}`;
    }
  }

  async findAllNewWordById(lessonId: number) {
    try {
      return await this.newWordRepo.find({ where: { lessonId } });
    } catch (error) {
      return `Không thể lấy thông tin từ mới do lỗi ${error}`;
    }
  }

  async findOne(newWordId: number) {
    try {
      return await this.newWordRepo.findOne({ where: { newWordId } });
    } catch (error) {
      return `Không thể lấy thông tin từ mới do lỗi ${error}`;
    }
  }

  async update(newWordId: number, updateNewWordDto: UpdateNewWordDto) {
    try {
      const update = await this.newWordRepo.findOneBy({ newWordId });
      if (!update) {
        throw new NotFoundException('Khóa học này không tồn tại!');
      }
      const result = this.newWordRepo.create({
        ...update,
        newWordId,
        ...updateNewWordDto,
      });
      await this.newWordRepo.save(result);
      return result;
    } catch (error) {
      return `Không thể sửa nội dung bởi lỗi ${error}`;
    }
  }

  async remove(newWordId: number) {
    try {
      let newWord = await this.newWordRepo.find({ where: { newWordId } });
      return this.newWordRepo.remove(newWord);
    } catch (error) {
      return `Không thể xóa do lỗi ${error}`;
    }
  }
}
