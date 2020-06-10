import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpService } from '@nestjs/common';
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
        let user = await userService.getUser(profile.username);

        if (!user) {
          let newUser: User = {
            username: profile.username,
            githubId: profile.id,
            githubToken: accessToken,
            validated: this.config.get('IS_BETA') === 'true' ? false : true,
          };
          user = await userService.createUser(newUser);

          const text = `New user to validate registered : ${profile.username}`;
          await this.httpService
            .post(
              'https://hooks.slack.com/services/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',
              { text },
              {
                headers: {
                  'Content-type': 'application/json',
                },
              },
            )
            .toPromise();
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
