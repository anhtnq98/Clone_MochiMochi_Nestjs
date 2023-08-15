import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { NewWordsService } from './new_words.service';
import { CreateNewWordDto } from './dto/create-new_word.dto';
import { UpdateNewWordDto } from './dto/update-new_word.dto';
import { Response } from 'express';

@Controller('/api/v1/new_words')
export class NewWordsController {
  constructor(private readonly newWordsService: NewWordsService) {}

  @Post()
  create(@Body() createNewWordDto: CreateNewWordDto, @Res() res: Response) {
    return this.newWordsService.create(createNewWordDto, res);
  }

  @Get()
  findAll() {
    return this.newWordsService.findAll();
  }

  @Get(':lessonId')
  findAllNewWordById(@Param('lessonId') lessonId: string) {
    return this.newWordsService.findAllNewWordById(+lessonId);
  }

  @Get('/new_word/:newWordId')
  findOne(@Param('newWordId') newWordId: string) {
    return this.newWordsService.findOne(+newWordId);
  }

  @Patch(':newWordId')
  update(
    @Param('newWordId') newWordId: string,
    @Body() updateNewWordDto: UpdateNewWordDto,
  ) {
    return this.newWordsService.update(+newWordId, updateNewWordDto);
  }

  @Delete(':newWordId')
  remove(@Param('newWordId') newWordId: string) {
    return this.newWordsService.remove(+newWordId);
  }
}
