import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { authStrategy } from '../utils/github';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, userService: UsersService) {
    super(
      {
        clientID: config.get('CLIENT_ID'),
        clientSecret: config.get('CLIENT_SECRET'),
        callbackURL: config.get('CALLBACK_URL'),
      },

      async (accessToken, tokenSecret, profile, done) => {
        let user = await userService.githubAuth(accessToken, profile);
        return done(null, user);
      },
    );
  }
}
