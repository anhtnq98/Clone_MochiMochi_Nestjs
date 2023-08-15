import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Response } from 'express';

@Controller('/api/v1/tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  create(@Body() createTestDto: CreateTestDto, @Res() res: Response) {
    return this.testsService.create(createTestDto, res);
  }

  @Get()
  findAll() {
    return this.testsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(+id);
  }

  @Patch(':testId')
  update(@Param('testId') testId: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(+testId, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testsService.remove(+id);
  }
}
