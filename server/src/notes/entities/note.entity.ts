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

  @ManyToOne((type) => User, (user) => user.note)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

}
