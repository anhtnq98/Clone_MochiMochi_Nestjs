import { Note } from 'src/notes/entities/note.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn()
  userId: string = uuidv4();

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  experience: number;

  @Column()
  trophy: string;

  @Column()
  role: number;

  @Column()
  photoURL: string;

  @OneToMany(() => Note, (note) => note.userId)
  note: Note[];
}
