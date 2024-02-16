import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameEntity } from './game.entity';
import { UserEntity } from './user.entity';

@Entity('gamesUsers')
export class GameUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column()
  userId: number;

  @Column()
  correct: number;

  @Column()
  incorrect: number;

  @ManyToOne(() => GameEntity)
  game: GameEntity;

  @ManyToOne(() => UserEntity, (user) => user.gameUser)
  user: UserEntity;
}
