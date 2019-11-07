import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super(
      {
        clientID: config.get('CLIENT_ID'),
        clientSecret: config.get('CLIENT_SECRET'),
        callbackURL: config.get('CALLBACK_URL'),
        scope: ['login', 'emails'],
      },
      async (accessToken, tokenSecret, profile, done) => {
        const user: any = {};
        user.displayName = profile.displayName;
        user.username = profile.username;

        user.githubAccount = {
          githubId: profile.id,
          githubToken: accessToken,
        };

        return done(null, user);
      },
    );
  }
}
