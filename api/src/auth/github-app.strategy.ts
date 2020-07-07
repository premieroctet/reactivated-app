import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class GitHubAppStrategy extends PassportStrategy(
  Strategy,
  'github-app',
) {
  constructor(config: ConfigService, userService: UsersService) {
    super(
      {
        clientID: config.get('APP_CLIENT_ID'),
        clientSecret: config.get('APP_CLIENT_SECRET'),
        callbackURL: config.get('APP_CALLBACK_URL'),
      },

      async (accessToken, tokenSecret, profile, done) => {
        let user = await userService.githubAuth(accessToken, profile);
        return done(null, user);
      },
    );
  }
}
