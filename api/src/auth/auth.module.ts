import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GitHubStrategy } from './github.strategy';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [AuthService, GitHubStrategy],
})
export class AuthModule {}
