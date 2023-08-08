import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    return this.authService.register(registerDto, res);
  }

  @Post('/google-login')
  google_login(@Body() registerDto: RegisterDto, @Res() res: Response) {
    return this.authService.google_login(registerDto, res);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<any> {
    return await this.authService.login(loginDto, res);
  }
}
