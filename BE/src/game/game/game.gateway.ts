import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './services/game.service';
import { AuthService } from '../../auth/services/auth.service';
import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AnswerQuestionDto } from './dto/answer-question.dto';

const LOBBY = 'lobby';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  clientIdUserIdMatching: { [id: string]: number } = {};
  clientIdGameRoomMatching: { [id: string]: string } = {};
  roomReadyMapping: { [roomId: string]: number } = {};

  constructor(
    private readonly gameService: GameService,
    private readonly authService: AuthService,
  ) {}

  checkConnectionValidity(client: Socket) {
    const token = client.handshake.headers.cookie
      .split('; ')
      .map((cookie) => cookie.split('=').map((e) => decodeURIComponent(e)))
      .find(([key]) => key === 'token')[1];

    try {
      this.authService.verifyToken(token);
    } catch (error) {
      Logger.warn('Token verification went wrong.');
      client.emit('error');
      client.disconnect();
      return false;
    }
    const payload = this.authService.decodeJwt(token);

    if (Object.values(this.clientIdUserIdMatching).includes(payload.userId)) {
      Logger.warn('Player is already connected.');
      client.emit('error', 'Du bist bereits angemeldet.');
      client.disconnect();
      return false;
    }

    this.clientIdUserIdMatching[client.id] = payload.userId;
    return true;
  }

  async handleConnection(client: Socket) {
    Logger.log('Client connected');

    this.checkConnectionValidity(client);
  }

  @SubscribeMessage('join-lobby')
  async joinLobby(@ConnectedSocket() client: Socket) {
    client.join(LOBBY);
    if (this.server.sockets.adapter.rooms.get(LOBBY).size > 1) {
      const possiblePlayers = Array.from(
        this.server.sockets.adapter.rooms.get(LOBBY),
      ).filter((id) => id !== client.id);

      const player2Client = this.server.sockets.sockets.get(
        possiblePlayers[Math.floor(Math.random() * possiblePlayers.length)],
      );

      client.leave(LOBBY);
      player2Client.leave(LOBBY);

      const gameId = await this.gameService.createGame(
        { isCoop: 1 },
        this.clientIdUserIdMatching[client.id],
        this.clientIdUserIdMatching[player2Client.id],
      );

      const roomId = `game_${gameId}`;

      client.join(roomId);
      player2Client.join(roomId);
      this.clientIdGameRoomMatching[client.id] = roomId;
      this.clientIdGameRoomMatching[player2Client.id] = roomId;
      this.roomReadyMapping[gameId] = 0;

      Logger.log(`Game with id ${roomId} started`);
      this.server.to(roomId).emit('game-start', gameId);

      const question = await this.gameService.getCurrentQuestion(
        gameId,
        this.clientIdUserIdMatching[client.id],
      );

      this.server.to(roomId).emit('current-question', question);
    }
  }

  @SubscribeMessage('resume-game')
  async resumeGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: number,
  ) {
    const userId = this.clientIdUserIdMatching[client.id];

    try {
      this.gameService.checkIfUserBelongsToGame(gameId, userId);
    } catch {
      client.emit('error', 'Du bist diesem Spiel nicht zugeordnet.');
      client.disconnect();
    }
    const roomId = `game_${gameId}`;
    client.join(roomId);
    this.clientIdGameRoomMatching[client.id] = roomId;

    if (this.server.sockets.adapter.rooms.get(roomId).size > 1) {
      Logger.log(`Game with id ${roomId} started`);
      this.server.to(roomId).emit('game-start', gameId);

      const question = await this.gameService.getCurrentQuestion(
        gameId,
        this.clientIdUserIdMatching[client.id],
      );

      this.server.to(roomId).emit('current-question', question);
    }
  }

  @SubscribeMessage('answer-question')
  async answerQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody() { gameId, answer }: { gameId: number; answer: string },
  ) {
    const userId = this.clientIdUserIdMatching[client.id];

    try {
      this.gameService.checkIfUserBelongsToGame(gameId, userId);
    } catch {
      client.emit('error', 'Du bist diesem Spiel nicht zugeordnet.');
      client.disconnect();
    }

    const roomId = `game_${gameId}`;
    const otherPlayerId =
      this.clientIdUserIdMatching[
        Array.from(this.server.sockets.adapter.rooms.get(roomId)).filter(
          (id) => id !== client.id,
        )[0]
      ];

    const result = await this.gameService.answerQuestion(
      gameId,
      userId,
      plainToInstance(AnswerQuestionDto, {
        answer,
      }),
    );
    await this.gameService.answerQuestion(
      gameId,
      otherPlayerId,
      plainToInstance(AnswerQuestionDto, {
        answer,
      }),
    );

    this.server.to(roomId).emit('question-answered', result);
  }

  @SubscribeMessage('current-question')
  async currentQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: number,
  ) {
    const userId = this.clientIdUserIdMatching[client.id];

    try {
      this.gameService.checkIfUserBelongsToGame(gameId, userId);
    } catch {
      client.emit('error', 'Du bist diesem Spiel nicht zugeordnet.');
      client.disconnect();
    }

    const roomId = `game_${gameId}`;
    this.roomReadyMapping[gameId] = this.roomReadyMapping[gameId] + 1;

    if (this.roomReadyMapping[gameId] < 2) return;

    const question = await this.gameService.getCurrentQuestion(
      gameId,
      this.clientIdUserIdMatching[client.id],
    );

    this.roomReadyMapping[gameId] = 0;
    this.server.to(roomId).emit('current-question', question);
  }

  @SubscribeMessage('chat')
  chat(@ConnectedSocket() client: Socket, @MessageBody() message: string) {
    const room = Array.from(client.rooms).find((r) => r.startsWith('game_'));
    client.broadcast.to(room).emit('chat', message);
  }

  handleDisconnect(client: Socket) {
    if (this.clientIdGameRoomMatching[client.id]) {
      client.broadcast
        .to(this.clientIdGameRoomMatching[client.id])
        .emit('player-left');
    }
    const roomId = this.clientIdGameRoomMatching[client.id];
    delete this.roomReadyMapping[roomId];
    delete this.clientIdGameRoomMatching[client.id];
    delete this.clientIdUserIdMatching[client.id];

    Logger.log(`client disconnected`);
  }
}
