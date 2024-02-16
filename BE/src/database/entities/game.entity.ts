import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserEntity } from './user.entity';
import { GameUserEntity } from './game-user.entity';

@Entity('games')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isCoop: number;

  @OneToMany(() => GameUserEntity, (userGame) => userGame.game)
  gameUser: GameUserEntity;

  @ManyToMany(() => QuestionEntity)
  @JoinTable({
    name: 'gamesQuestions',
    joinColumn: {
      name: 'gameId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'questionId',
      referencedColumnName: 'id',
    },
  })
  questions: QuestionEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'gamesUsers',
    joinColumn: {
      name: 'gameId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];
}
