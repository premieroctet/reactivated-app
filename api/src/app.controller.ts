import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('auth')
  @UseGuards(AuthGuard('github'))
  @Get('/auth/github')
  async login(@Request() req) {
    return {};
  }

  @ApiTags('auth')
  @UseGuards(AuthGuard('github-app'))
  @Get('app/auth/github')
  async appLogin(@Request() req) {
    return {};
  }

  @ApiTags('auth')
  @UseGuards(AuthGuard('github'))
  @Get('/auth/github/callback')
  async redirect(@Request() req) {
    const {
      githubToken,
      username,
      githubId,
      id,
      validated,
      avatarUrl,
    }: User = req.user;
    const jwt = this.authService.createToken({
      githubToken: githubToken,
      userName: username,
      githubId: githubId,
      userId: id,
      validated,
      avatarUrl,
    });

    return { token: jwt };
  }

  @ApiTags('auth')
  @UseGuards(AuthGuard('github-app'))
  @Get('app/auth/github/callback')
  async appRedirect(@Request() req) {
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
