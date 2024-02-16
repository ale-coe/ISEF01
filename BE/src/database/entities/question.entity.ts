import { Type } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { GameEntity } from './game.entity';
import { GameQuestionEntity } from './game-question.entity';

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  inEdit: number;

  @Type(() => AnswerEntity)
  @OneToMany(() => AnswerEntity, (answer) => answer.question, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  answers: AnswerEntity[];

  @ManyToMany(() => GameEntity)
  game: GameEntity;

  @OneToOne(() => GameQuestionEntity)
  gameQuestion: GameQuestionEntity;
}
