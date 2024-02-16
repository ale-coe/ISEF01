import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/middleware/jwt.middleware';
import { DatabaseModule } from './database/database.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        const pathToEnv = join(__dirname, '..', '.env');
        console.log(pathToEnv);
        return pathToEnv;
      })(),
      validationSchema: Joi.object({ SUPER_SECRET: Joi.string().required() }),
    }),
    DatabaseModule,
    AuthModule,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('questions', 'game');
  }
}
