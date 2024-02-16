import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CustomRequestInterface } from 'src/auth/interfaces/custom-request.interface';
import { StartGameDto } from './dto/start-game.dto';
import { GameService } from './services/game.service';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('ongoing')
  getOngoingGames(@Req() req: CustomRequestInterface) {
    const userId = req.userId;
    return this.gameService.getOngoingGames(userId);
  }

  @Get('done')
  getDoneGames(@Req() req: CustomRequestInterface) {
    const userId = req.userId;
    return this.gameService.getDoneGames(userId);
  }

  @Post('start-comp')
  startCompGame(
    @Body() game: StartGameDto,
    @Req() req: CustomRequestInterface,
  ) {
    const userId = req.userId;
    return this.gameService.startCompGame(game, userId);
  }

  @Get(':gameId/current-question')
  getCurrentQuestion(
    @Param('gameId') gameId: number,
    @Req() req: CustomRequestInterface,
  ) {
    const userId = req.userId;
    return this.gameService.getCurrentQuestion(gameId, userId);
  }

  @Put(':gameId/answer-question')
  answerQuestion(
    @Param('gameId') gameId: number,
    @Req() req: CustomRequestInterface,
    @Body() answer: AnswerQuestionDto,
  ) {
    const userId = req.userId;
    return this.gameService.answerQuestion(gameId, userId, answer);
  }
}
