import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, userService: UsersService, User: User) {
    super(
      {
        clientID: config.get('CLIENT_ID'),
        clientSecret: config.get('CLIENT_SECRET'),
        callbackURL: config.get('CALLBACK_URL'),
        scope: ['login', 'emails'],
      },
      async (accessToken, tokenSecret, profile, done) => {
        let user = userService.getUser(profile.id);

        if (!user) {
          const newUser: User = { username: profile.username };
          user = userService.createUser(newUser);
        }

        return done(null, user);
      },
    );
  }
}
