import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('github'))
  @Get('/auth/github')
  async login(@Request() req) {
    return {};
  }

  @UseGuards(AuthGuard('github'))
  @Get('/auth/github/callback')
  async redirect(@Request() req) {
    return req.user;
  }
}
