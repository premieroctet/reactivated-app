import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GitHubStrategy } from './github.strategy';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { JwtStrategy } from './jwt.strategy';
import { GitHubAppStrategy } from './github-app.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('CLIENT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, GitHubStrategy, GitHubAppStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
