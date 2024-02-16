import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { LoginBodyDto } from '../dto/login-body.dto';
import { compareSync } from 'bcrypt';
import { sign, decode, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async login(loginBody: LoginBodyDto) {
    const user = await this.userRepo.findOne({
      where: { mail: loginBody.username },
    });

    if (!user) {
      Logger.warn('user not found');
      throw new UnauthorizedException();
    }

    const compareResult = compareSync(loginBody.password, user.password);

    if (!compareResult) {
      Logger.warn('wrong password');
      throw new UnauthorizedException();
    }

    return this.createJWT(user.mail, user.id);
  }

  createJWT(mail: string, userId: number) {
    let expiresIn: string | number = 86_400_000;

    return sign({ mail, userId }, process.env.SUPER_SECRET, {
      expiresIn,
    });
  }

  decodeJwt(token: string) {
    return decode(token) as JwtPayloadInterface;
  }

  validateTokenFromRequest(req: Request) {
    const token = this.extractTokenFromHeader(req);
    this.verifyToken(token);
    return token;
  }

  extractTokenFromHeader(req: Request) {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }

  verifyToken(token: string) {
    try {
      verify(token, process.env.SUPER_SECRET);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
