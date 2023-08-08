import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private notesRepo: Repository<Note>) {}
  async create(createNoteDto: CreateNoteDto, res: Response) {
    try {
      let newNote = new Note(createNoteDto);
      let addNewNote = this.notesRepo.create(newNote);
      await this.notesRepo.save(addNewNote);
      return res.status(201).json({
        message: 'Thêm ghi chú thành công!',
        course: newNote,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Thêm ghi chú thất bại!',
        error: error,
      });
    }
  }

  async findAll() {
    return await this.notesRepo.find({});
  }

  async update(noteId: number, updateNoteDto: UpdateNoteDto) {
    try {
      const updateNote = await this.notesRepo.findOneBy({ noteId });
      if (!updateNote) {
        throw new NotFoundException('Ghi chú này không tồn tại!');
      }
      return await this.notesRepo.update(noteId, {
        ...(updateNoteDto.userId && { userId: updateNoteDto.userId }),
        ...(updateNoteDto.content && { content: updateNoteDto.content }),
        ...(updateNoteDto.complete && { complete: updateNoteDto.complete }),
      });
    } catch (error) {
      return `Không thể sửa nội dung ghi chú bởi lỗi ${error}`;
    }
  }

  async remove(noteId: number) {
    try {
      const deleteNote = await this.notesRepo.findOneBy({ noteId });
      if (!deleteNote) {
        throw new NotFoundException('Ghi chú này không tồn tại!');
      }
      return await this.notesRepo.remove(deleteNote);
    } catch (error) {
      return `Không thể xóa ghi chú bởi lỗi ${error}`;
    }
  }
}
