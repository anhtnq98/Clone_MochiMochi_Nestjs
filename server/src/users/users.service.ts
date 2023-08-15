import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Note } from 'src/notes/entities/note.entity';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Note) readonly noteRepository: Repository<Note>,
  ) {}

  async findAll() {
    return await this.usersRepo.find({
      relations: ['notes'],
    });
  }

  async searchUser(searchValue: string) {
    try {
      return await this.usersRepo.find({
        relations: ['notes'],
        where: {
          userName: Like(`%${searchValue}%`),
        },
      });
    } catch (error) {
      throw new Error(`Không thể lấy thông tin chủ đề do lỗi ${error}`);
    }
  }

  async findOne(email: string) {
    try {
      const findUser = await this.usersRepo.findOne({
        where: { email },
      });
      return findUser;
    } catch (error) {
      return error;
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto, res: Response) {
    const user = await this.usersRepo.findOneBy({ userId });
    if (!user) {
      return 'no have any user';
    }
    try {
      await this.usersRepo.update(userId, {
        ...(updateUserDto.userName && { userName: updateUserDto.userName }),
        ...(updateUserDto.email && { email: updateUserDto.email }),
        ...(updateUserDto.password && { password: updateUserDto.password }),
        ...(updateUserDto.experience && {
          experience: updateUserDto.experience,
        }),
        ...(updateUserDto.trophy && { trophy: updateUserDto.trophy }),
        ...(updateUserDto.role && { role: updateUserDto.role }),
        ...(updateUserDto.photoURL && { photoURL: updateUserDto.photoURL }),
      });
      return res.status(200).json({
        message: 'Sửa thông tin người dùng thành công! 🌞',
      });
    } catch (error) {
      return res.status(200).json({
        message: 'Không thể sửa thông tin người dùng! ⚠️',
      });
    }
  }

  remove(userId: string) {
    return `This action removes a #${userId} user`;
  }
}
