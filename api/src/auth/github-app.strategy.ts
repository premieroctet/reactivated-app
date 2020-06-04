import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

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
        console.log('constructor -> accessToken', accessToken);
        let user = await userService.getUser(profile.username);

        if (!user) {
          let newUser: User = {
            username: profile.username,
            githubId: profile.id,
            githubToken: accessToken,
          };
          user = await userService.createUser(newUser);
        } else {
          await userService.updateUser({
            ...user,
            githubToken: accessToken,
          });
        }

        return done(null, user);
      },
    );
  }
}
