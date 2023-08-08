import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  noteId: number;

  @IsNotEmpty()
  userId: string;

  @MaxLength(80)
  content: string;

  @IsNotEmpty()
  complete: number;
}
