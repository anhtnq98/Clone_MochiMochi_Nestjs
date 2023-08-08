import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
export class RegisterDto {
  @Length(3, 11)
  @IsString()
  userName: string;

  @IsEmail()
  @IsString()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  experience: number;

  @IsNotEmpty()
  @IsString()
  trophy: string;

  @IsNotEmpty()
  role: number;

  @IsNotEmpty()
  @IsString()
  photoURL: string;
}
