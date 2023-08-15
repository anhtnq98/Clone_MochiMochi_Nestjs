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
import { TestExsService } from './test_exs.service';
import { CreateTestExDto } from './dto/create-test_ex.dto';
import { UpdateTestExDto } from './dto/update-test_ex.dto';
import { Response } from 'express';

@Controller('/api/v1/test_exs')
export class TestExsController {
  constructor(private readonly testExsService: TestExsService) {}

  @Post()
  create(@Body() createTestExDto: CreateTestExDto, @Res() res: Response) {
    return this.testExsService.create(createTestExDto, res);
  }

  @Get()
  findAllEx() {
    return this.testExsService.findAllEx();
  }

  @Get(':testId')
  findAll(@Param('testId') testId: string) {
    return this.testExsService.findAll(+testId);
  }

  @Patch(':exId')
  update(
    @Param('exId') exId: string,
    @Body() updateTestExDto: UpdateTestExDto,
    @Res() res: Response,
  ) {
    return this.testExsService.update(+exId, updateTestExDto, res);
  }

  @Delete(':exId')
  remove(@Param('exId') exId: string) {
    return this.testExsService.remove(+exId);
  }
}
