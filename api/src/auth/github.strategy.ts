import { HttpService, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    userService: UsersService,
    private readonly httpService: HttpService,
  ) {
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
