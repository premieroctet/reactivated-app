import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('CLIENT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (this.config.get('IS_BETA') === 'true' && payload.validated === false) {
      throw new UnauthorizedException('Your account will soon be validated.');
    }

    return {
      username: payload.userName,
      githubId: payload.githubId,
      githubToken: payload.githubToken,
      id: payload.userId,
      validated: payload.validated,
    };
  }
}
