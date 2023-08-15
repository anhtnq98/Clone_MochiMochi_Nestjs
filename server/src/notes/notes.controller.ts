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
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Response } from 'express';

@Controller('/api/v1/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Res() res: Response) {
    return this.notesService.create(createNoteDto, res);
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  // @Get(':userId')
  // findAllByUserId(@Param('userId') userId: string) {
  //   return this.notesService.findAllByUserId(userId);
  // }

  @Patch(':noteId')
  update(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(+noteId, updateNoteDto);
  }

  @Delete(':noteId')
  remove(@Param('noteId') noteId: string) {
    return this.notesService.remove(+noteId);
  }
}
