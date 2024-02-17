import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './services/auth.service';
import { LoginBodyDto } from './dto/login-body.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: LoginBodyDto, @Res() res: Response) {
    const token = await this.authService.login(loginBody);
    const expires = new Date(Date.now() + 86_400_000);
    console.log(process.env);
    res.cookie('token', token, {
      httpOnly: true,
      expires,
      sameSite: process.env.DEVELOPMENT === 'false',
      secure: process.env.DEVELOPMENT === 'false',
    });
    res.cookie('username', loginBody.username, {
      expires,
    });

    res.send();
  }

  @Get('validate')
  checkToken(@Req() request: Request) {
    return this.authService.validateTokenFromRequest(request);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    const expires = new Date(0);

    res.cookie('token', '', {
      httpOnly: true,
      expires,
    });
    res.cookie('username', '', {
      expires,
    });

    res.send();
  }
}
