import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { ApiUseTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @ApiUseTags('auth')
  @UseGuards(AuthGuard('github'))
  @Get('/auth/github')
  async login(@Request() req) {
    return {};
  }

  @ApiUseTags('auth')
  @UseGuards(AuthGuard('github'))
  @Get('/auth/github/callback')
  async redirect(@Request() req) {
    const { githubToken, username, githubId, id } = req.user;
    const jwt = this.authService.createToken({
      githubToken: githubToken,
      userName: username,
      githubId: githubId,
      userId: id,
    });

    return { token: jwt };
  }
}
