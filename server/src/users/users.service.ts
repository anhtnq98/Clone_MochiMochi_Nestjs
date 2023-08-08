import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findAll() {
    return await this.usersRepo.find({});
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

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepo.findOneBy({ userId });
    if (!user) {
      return 'no have any user';
    }
    try {
      const result = await this.usersRepo.update(userId, {
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
      return 'update successfully';
    } catch (error) {
      return error;
    }
  }

  remove(userId: string) {
    return `This action removes a #${userId} user`;
  }
}
