import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { UsersModule } from '../users/users.module';
import { RepositoryModule } from '../repository/repository.module';
import { ConfigModule } from '../config/config.module';
import { PullRequestModule } from '../pull-request/pull-request.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    RepositoryModule,
    UsersModule,
    ConfigModule,
    PullRequestModule,
    QueueModule,
  ],
  controllers: [WebhooksController],
  providers: [],
})
export class WebhooksModule {}
