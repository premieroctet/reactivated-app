import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

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
        let user = await userService.getUser(profile.username);

        if (!user) {
          let newUser: User = {
            username: profile.username,
            githubId: profile.id,
            githubToken: accessToken,
          };
          user = await userService.createUser(newUser);
        }

        return done(null, user);
      },
    );
  }
}
