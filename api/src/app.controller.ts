import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('github'))
  @Get('/auth/github')
  async login(@Request() req) {
    return {};
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/test')
  async test(@Request() req) {
    return { hello: 'world' };
  }

  @UseGuards(AuthGuard('github'))
  @Get('/auth/github/callback')
  async redirect(@Request() req) {
    const jwt = this.authService.createToken({
      githubToken: req.user.githubToken,
      userName: req.user.username,
      githubId: req.user.githubId,
    });
    return jwt;
  }
}
