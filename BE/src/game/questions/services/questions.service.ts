import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { QuestionEntity } from '../../../database/entities/question.entity';
import { GameUserEntity } from '../../../database/entities/game-user.entity';
import { GameQuestionEntity } from '../../../database/entities/game-question.entity';
import { In, Repository } from 'typeorm';
import { GetQuestionsDto } from '../dto/get-questions.dto';
import { InsertQuestionDto, UpdateQuestionDto } from '../dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepo: Repository<QuestionEntity>,
    @InjectRepository(GameUserEntity)
    private readonly gameUserRepo: Repository<GameUserEntity>,
    @InjectRepository(GameQuestionEntity)
    private readonly gameQuestionRepo: Repository<GameQuestionEntity>,
  ) {}

  async insertQuestion(question: InsertQuestionDto) {
    const result = plainToInstance(QuestionEntity, question, {});
    await this.questionRepo.save(result);
  }

  async getQuestions(query: GetQuestionsDto) {
    return this.questionRepo.findAndCount({
      where: { inEdit: query.inEdit },
      take: query.limit,
      skip: query.offset,
      relations: { answers: { reasonWrongAnswer: true } },
    });
  }

  async putInEditMode(id: number) {
    await this.checkIfQuestionIsInOngoingGame(id);

    await this.questionRepo.save({
      id,
      inEdit: 1,
    });
  }

  async updateQuestion(question: UpdateQuestionDto) {
    const result = plainToInstance(QuestionEntity, question, {});

    await this.questionRepo.save(result);
  }

  async deleteQuestion(id: number) {
    await this.checkIfQuestionIsInOngoingGame(id);

    await this.questionRepo.delete(id);
  }

  async checkIfQuestionIsInOngoingGame(questionId: number) {
    const ongoingGames = await this.gameUserRepo
      .createQueryBuilder('gu')
      .where('gu.correct + gu.incorrect < 8')
      .getMany();

    const ongoingGamesWithQuestion = await this.gameQuestionRepo.find({
      where: {
        questionId,
        gameId: In(ongoingGames.map(({ gameId }) => gameId)),
      },
    });

    if (ongoingGamesWithQuestion.length > 0) {
      throw new BadRequestException(
        'Die Fage ist in einem aktiven Spiel, daher kann sie nicht bearbeitet werden.',
      );
    }
  }
}
