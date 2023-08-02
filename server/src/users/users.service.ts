import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>, // Repository
  ) {}

  async register(registerDto: RegisterDto, res: Response) {
    try {
      const checkEmail = await this.usersRepo.findOne({
        where: { email: registerDto.email },
      });
      if (checkEmail) {
        return res.status(400).json({
          message: 'Email đã được đăng ký',
        });
      }
      const { userName, email, password, experience, trophy, role, photoURL } =
        registerDto;
      // Mã hóa mật khẩu
      let salt = bcrypt.genSaltSync(10);
      let hashPassword = bcrypt.hashSync(password, salt);
      const newUser = {
        userName,
        email,
        password: hashPassword,
        experience: +experience,
        trophy,
        role: +role,
        photoURL,
      };
      let register = this.usersRepo.create(newUser);
      this.usersRepo.save(register);
      return res.status(201).json({
        message: 'Thêm người dùng mới thành công',
        email: newUser.email,
      });
    } catch (error) {
      return `Không thể thêm người dùng mới bởi lỗi ${error}`;
    }
  }

  async google_login(registerDto: RegisterDto, res: Response) {
    try {
      const checkEmail = await this.usersRepo.findOne({
        where: { email: registerDto.email },
      });
      if (checkEmail) {
        return res.status(400).json({
          message: 'Email đã được đăng ký',
        });
      }
      const { userName, email, password, experience, trophy, role, photoURL } =
        registerDto;
      // Mã hóa mật khẩu
      let salt = bcrypt.genSaltSync(10);
      let hashPassword = bcrypt.hashSync(password, salt);
      const newUser = {
        userName,
        email,
        password: hashPassword,
        experience: +experience,
        trophy,
        role: +role,
        photoURL,
      };
      let gglogin = this.usersRepo.create(newUser);
      this.usersRepo.save(gglogin);
      return res.status(201).json({
        message: 'Đăng nhập bằng Google thành công',
        email: newUser.email,
      });
    } catch (error) {
      return `Không thể đăng nhập vào Google bởi lỗi ${error}`;
    }
  }

  async login(loginDto: LoginDto, res: Response) {
    try {
      const user = await this.usersRepo.findOne({
        where: { email: loginDto.email },
      });

      if (!user) {
        return res.status(401).json({
          message: 'Email này không tồn tại',
        });
      }

      let isMatch = bcrypt.compareSync(loginDto.password, user.password);
      if (isMatch === true) {
        res.status(200).json({
          message: 'Đăng nhập thành công',
          email: loginDto.email,
        });
      } else {
        res.status(401).json({
          message: 'Mật khẩu khôn chính xác',
        });
      }
    } catch (error) {
      return `Không thể đăng nhập bởi lỗi ${error}`;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(userId: string) {
    return `This action returns a #${userId} user`;
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${userId} user`;
  }

  remove(userId: string) {
    return `This action removes a #${userId} user`;
  }
}
