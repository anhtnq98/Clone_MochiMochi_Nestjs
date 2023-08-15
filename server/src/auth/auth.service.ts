import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { Note } from 'src/notes/entities/note.entity';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>, // @InjectRepository(Note)
  ) // private readonly notesRepo: Repository<Note>,
  {}
  async register(
    registerDto: RegisterDto,
    // notesDto: CreateNoteDto[],
    res: Response,
  ) {
    try {
      let checkUserName = await this.usersRepo.findOne({
        where: { userName: registerDto.userName },
      });
      if (checkUserName) {
        return res.status(401).json({
          message: 'Tên người dùng này đã tồn tại! 😣',
        });
      }

      let checkEmail = await this.usersRepo.findOne({
        where: { email: registerDto.email },
      });
      if (checkEmail) {
        return res.status(401).json({
          message: 'Email này được đăng ký rồi! 😣',
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
      // let notes = this.notesRepo.create(notesDto);
      // register.notes = notes;
      await this.usersRepo.save(register);
      return res.status(201).json({
        message: 'Đăng ký thành công! 🍀',
        user: {
          userName: newUser.userName,
          email: newUser.email,
        },
      });
    } catch (error) {
      return `Không thể thêm người dùng mới bởi lỗi ${error}`;
    }
  }

  async google_login(registerDto: RegisterDto, res: Response) {
    try {
      let checkEmail = await this.usersRepo.findOne({
        where: { email: registerDto.email },
      });
      console.log(registerDto, '<---- registerDto');

      if (checkEmail) {
        return res.status(201).json({
          message: 'Đăng nhập bằng Google thành công 🍀',
          email: checkEmail.email,
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
      console.log(newUser, '<--- this is newuser');

      let gglogin = this.usersRepo.create(newUser);
      this.usersRepo.save(gglogin);
      return res.status(201).json({
        message: 'Đăng nhập bằng Google thành công 🍀',
        user: {
          userName: newUser.userName,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.log(error);
      return `Không thể đăng nhập vào Google bởi lỗi ${error}`;
    }
  }

  async login(loginDto: LoginDto, @Res() res: Response): Promise<any> {
    console.log('first');
    try {
      const user = await this.usersRepo.findOne({
        where: { email: loginDto.email },
      });
      console.log(user);

      if (!user) {
        return res.status(401).json({
          message: 'Email này không tồn tại! 🚫',
        });
      }

      let isMatch = bcrypt.compareSync(loginDto.password, user.password);
      if (isMatch === true) {
        res.status(200).json({
          message: 'Đăng nhập thành công! 🍀',
          user: {
            email: loginDto.email,
          },
        });
      } else {
        res.status(401).json({
          message: 'Mật khẩu không chính xác 🚫',
        });
      }
    } catch (error) {
      return `Không thể đăng nhập bởi lỗi ${error}`;
    }
  }
}
