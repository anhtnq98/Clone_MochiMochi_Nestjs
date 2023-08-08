import { Injectable } from '@nestjs/common';
import { CreateNewWordDto } from './dto/create-new_word.dto';
import { UpdateNewWordDto } from './dto/update-new_word.dto';
import { Response } from 'express';
import { NewWord } from './entities/new_word.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NewWordsService {
  constructor(
    @InjectRepository(NewWord) private newWordRepo: Repository<NewWord>,
  ) {}

  async create(createNewWordDto: CreateNewWordDto, res: Response) {
    try {
      let newWord = await this.newWordRepo.findOne({
        where: { title: createNewWordDto.title },
      });
      if (newWord) {
        return res.status(401).json({
          message: 'Từ mới này đã được thêm rồi!',
        });
      }
      let newNewWord = new NewWord(createNewWordDto);
      let addNewWord = this.newWordRepo.create(newNewWord);
      await this.newWordRepo.save(addNewWord);
      return res.status(201).json({
        message: 'Thêm từ mới thành công!',
        new_word: newNewWord,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Không thể thêm từ mới',
        error: error,
      });
    }
  }

  async findAll(lessonId: number) {
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

  update(id: number, updateNewWordDto: UpdateNewWordDto) {
    return `This action updates a #${id} newWord`;
  }

  remove(id: number) {
    return `This action removes a #${id} newWord`;
  }
}
