import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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

  @UseGuards(AuthGuard('github'))
  @Get('/auth/github/callback')
  async redirect(@Request() req) {
    const { githubToken, username, githubId } = req.user;
    const jwt = this.authService.createToken({
      githubToken: githubToken,
      userName: username,
      githubId: githubId,
    });
    return jwt;
  }
}
