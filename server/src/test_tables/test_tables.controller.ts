import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { TestTablesService } from './test_tables.service';
import { CreateTestTableDto } from './dto/create-test_table.dto';
import { UpdateTestTableDto } from './dto/update-test_table.dto';
import { Response } from 'express';

@Controller('/api/v1/test_tables')
export class TestTablesController {
  constructor(private readonly testTablesService: TestTablesService) {}

  @Post()
  create(@Body() createTestTableDto: CreateTestTableDto, @Res() res: Response) {
    return this.testTablesService.create(createTestTableDto, res);
  }

  @Get()
  findAll() {
    return this.testTablesService.findAll();
  }

  @Get('/search')
  async searchTestTable(@Query('searchValue') searchValue: string) {
    return await this.testTablesService.searchTestTable(searchValue);
  }

  @Get(':testTableType')
  findAllTestTables(@Param('testTableType') testTableType: number) {
    return this.testTablesService.findAllTestTables(+testTableType);
  }

  @Patch(':testTableId')
  update(
    @Param('testTableId') testTableId: string,
    @Body() updateTestTableDto: UpdateTestTableDto,
  ) {
    return this.testTablesService.update(+testTableId, updateTestTableDto);
  }

  @Delete(':testTableId')
  remove(@Param('testTableId') testTableId: string) {
    return this.testTablesService.remove(+testTableId);
  }
}
