import { CreateNoteDto } from './../dto/create-note.dto';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('notes')
export class Note {
  @PrimaryColumn()
  noteId: number;

  @Column()
  userId: string;

  @Column()
  content: string;

  @Column()
  complete: number;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  constructor(CreateNoteDto: Object = {}) {
    Object.assign(this, CreateNoteDto);
  }
}
