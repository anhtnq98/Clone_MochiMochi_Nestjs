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

  @Get(':lessonId')
  findAll(@Param('lessonId') lessonId: string) {
    return this.newWordsService.findAll(+lessonId);
  }

  @Get('/new_word/:newWordId')
  findOne(@Param('newWordId') newWordId: string) {
    return this.newWordsService.findOne(+newWordId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewWordDto: UpdateNewWordDto) {
    return this.newWordsService.update(+id, updateNewWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newWordsService.remove(+id);
  }
}
