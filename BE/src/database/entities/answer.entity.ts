import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';
import { ReasonWrongAnswerEntity } from './reason-wrong-answer.entity';
import { Type } from 'class-transformer';

@Entity('answers')
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string;

  @Column()
  isCorrect: number;

  @ManyToOne(() => QuestionEntity, (question) => question.answers)
  question: QuestionEntity;

  @Type(() => ReasonWrongAnswerEntity)
  @OneToOne(
    () => ReasonWrongAnswerEntity,
    (reasonWrongAnswer) => reasonWrongAnswer.answer,
    { cascade: true, onDelete: 'CASCADE' },
  )
  reasonWrongAnswer: ReasonWrongAnswerEntity;
}
