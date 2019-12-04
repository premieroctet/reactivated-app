import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('CLIENT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      username: payload.username,
      githubId: payload.id,
      githubToken: payload.accessToken,
      id: payload.userId,
    };
  }
}
