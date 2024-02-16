import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnswerEntity } from './answer.entity';

@Entity('reasonWrongAnswer')
export class ReasonWrongAnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;

  @OneToOne(() => AnswerEntity, (answer) => answer.reasonWrongAnswer)
  @JoinColumn()
  answer: AnswerEntity;
}
