import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameUserEntity } from './game-user.entity';
import { GameEntity } from './game.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mail: string;

  @Column()
  password: string;

  @OneToMany(() => GameUserEntity, (gameUser) => gameUser.user)
  gameUser: GameUserEntity[];

  @ManyToMany(() => GameEntity)
  games: GameEntity[];
}
