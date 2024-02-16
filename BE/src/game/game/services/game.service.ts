import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { In, Not, Repository } from 'typeorm';
import { GameQuestionEntity } from '../../../database/entities/game-question.entity';
import { GameUserEntity } from '../../../database/entities/game-user.entity';
import { GameEntity } from '../../../database/entities/game.entity';
import { QuestionEntity } from '../../../database/entities/question.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { AnswerQuestionDto } from '../dto/answer-question.dto';
import { GameResponseDto } from '../dto/game-response.dto';
import { QuestionResponseDto } from '../dto/question-response.dto';
import { StartGameDto } from '../dto/start-game.dto';

const MAX_QUESTION_INDEX = 7;

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepo: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(GameUserEntity)
    private readonly gameUserRepo: Repository<GameUserEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepo: Repository<QuestionEntity>,
    @InjectRepository(GameQuestionEntity)
    private readonly gameQuestionRepo: Repository<GameQuestionEntity>,
  ) {}

  async answerQuestion(
    gameId: number,
    userId: number,
    answer: AnswerQuestionDto,
  ) {
    await this.checkIfUserBelongsToGame(gameId, userId);
    const currentIndex = await this.getCurrentIndex(gameId, userId);

    const question = (await this.getCurrentQuestion(
      gameId,
      userId,
      true,
    )) as QuestionEntity;

    const givenAnswer = question.answers.find(
      (a) => a.answer === answer.answer,
    );
    const { isCorrect } = givenAnswer;

    await this.gameUserRepo
      .createQueryBuilder()
      .update()
      .set(
        isCorrect
          ? { correct: () => 'correct + 1' }
          : { incorrect: () => 'incorrect + 1' },
      )
      .where('gameId = :gameId', { gameId })
      .andWhere('userId = :userId', { userId })
      .execute();

    console.log();
    return isCorrect
      ? [currentIndex === MAX_QUESTION_INDEX, answer.answer]
      : [
          currentIndex === MAX_QUESTION_INDEX,
          answer.answer,
          question.answers.find((a) => !!a.isCorrect).answer,
          givenAnswer.reasonWrongAnswer?.reason || '',
        ];
  }

  async getOngoingGames(userId: number) {
    const result = await this.gameUserRepo
      .createQueryBuilder('gu')
      .where(`gu.correct + gu.incorrect <= ${MAX_QUESTION_INDEX}`)
      .andWhere('gu.userId = :userId', { userId })
      .getMany();

    const games = await this.gameRepo.find({
      relations: {
        gameUser: { user: true },
      },
      where: {
        id: In(result.map(({ gameId }) => gameId)),
      },
      order: { id: 'DESC' },
      take: 10,
    });

    return plainToInstance(GameResponseDto, games, {
      excludeExtraneousValues: true,
    });
  }

  async getDoneGames(userId: number) {
    const result = await this.gameUserRepo
      .createQueryBuilder('gu')
      .where(`gu.correct + gu.incorrect > ${MAX_QUESTION_INDEX}`)
      .andWhere('gu.userId = :userId', { userId })
      .getMany();

    const games = await this.gameRepo.find({
      relations: {
        gameUser: { user: true },
      },
      where: {
        id: In(result.map(({ gameId }) => gameId)),
      },
      order: { id: 'DESC' },
      take: 10,
    });

    return plainToInstance(GameResponseDto, games, {
      excludeExtraneousValues: true,
    });
  }

  async findOtherPlayerForCompGame(userId: number) {
    const otherPlayers = await this.userRepo.find({
      where: { id: Not(userId) },
    });
    return otherPlayers[Math.floor(Math.random() * otherPlayers.length)].id;
  }

  async startCompGame(game: StartGameDto, player1UserId: number) {
    const player2UserId = await this.findOtherPlayerForCompGame(player1UserId);
    return this.createGame(game, player1UserId, player2UserId);
  }

  async createGame(
    game: StartGameDto,
    player1UserId: number,
    player2UserId: number,
  ) {
    const possibleQuestions = await this.questionRepo.find({
      where: { inEdit: 0 },
    });

    const questions = this.getRandomQuestions(
      possibleQuestions,
      MAX_QUESTION_INDEX + 1,
    );

    if (!questions.length) {
      throw new BadRequestException(
        'Zu wenig Fragen vorhanden. Bitte mehr fragen einfügen oder Bearbeitungen abschließen.',
      );
    }

    const { id: gameId } = await this.gameRepo.save({ isCoop: game.isCoop });
    await this.gameUserRepo.save([
      {
        correct: 0,
        incorrect: 0,
        gameId,
        userId: player1UserId,
      },
      {
        correct: 0,
        incorrect: 0,
        gameId,
        userId: player2UserId,
      },
    ]);

    await this.gameQuestionRepo.save(
      questions.map(({ id: questionId }) => ({ gameId, questionId })),
    );

    return gameId;
  }

  async getCurrentQuestion(
    gameId: number,
    userId: number,
    checkAnswer = false,
  ) {
    await this.checkIfUserBelongsToGame(gameId, userId);
    const currentIndex = await this.getCurrentIndex(gameId, userId);

    const gameQuestion = await this.gameQuestionRepo.find({
      relations: { question: { answers: { reasonWrongAnswer: checkAnswer } } },
      where: { gameId },
      order: { id: 'ASC' },
      take: 1,
      skip: currentIndex,
    });

    return checkAnswer
      ? gameQuestion[0].question
      : plainToInstance(QuestionResponseDto, gameQuestion[0].question, {
          excludeExtraneousValues: true,
        });
  }

  async checkIfUserBelongsToGame(gameId: number, userId: number) {
    const game = await this.gameUserRepo.findOne({ where: { gameId, userId } });

    if (!game) {
      throw new ForbiddenException();
    }
  }

  async getCurrentIndex(gameId: number, userId: number) {
    const currentIndex = await this.gameUserRepo
      .createQueryBuilder('gu')
      .select('gu.correct + gu.incorrect', 'currentIndex')
      .where('gu.userId = :userId', { userId })
      .andWhere('gu.gameId = :gameId', { gameId })
      .execute();

    if (currentIndex[0].currentIndex > MAX_QUESTION_INDEX) {
      throw new BadRequestException();
    }

    return currentIndex[0].currentIndex;
  }

  getRandomQuestions(arr: QuestionEntity[], amountQuestions: number) {
    if (arr.length < amountQuestions) {
      return [];
    }

    let result = arr.slice(); // Clone the array to avoid modifying the original
    let n = arr.length;
    let temp: QuestionEntity;
    let index: number;

    for (let i = n - 1; i > 0 && n - i <= amountQuestions; i--) {
      // Pick a random index from 0 to i
      index = Math.floor(Math.random() * (i + 1));

      // Swap arr[i] with the element at the random index
      temp = result[i];
      result[i] = result[index];
      result[index] = temp;
    }

    return result.slice(-amountQuestions);
  }
}
