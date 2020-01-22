import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { UsersModule } from '../users/users.module';
import { RepositoryModule } from '../repository/repository.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [RepositoryModule, UsersModule, ConfigModule],
  controllers: [WebhooksController],
  providers: [],
})
export class WebhooksModule {}
