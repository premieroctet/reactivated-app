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
              this.config.get('SLACK_BETA_URL'),
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
