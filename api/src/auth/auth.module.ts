import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GitHubStrategy } from './github.strategy';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [AuthService, GitHubStrategy],
})
export class AuthModule {}
