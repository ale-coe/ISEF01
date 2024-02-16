import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('gamesQuestions')
export class GameQuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column()
  questionId: number;

  @OneToOne(() => QuestionEntity)
  @JoinColumn()
  question: QuestionEntity;
}
