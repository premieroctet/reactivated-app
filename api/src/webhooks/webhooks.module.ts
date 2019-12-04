import { Module, HttpModule } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { UsersModule } from '../users/users.module';
import { RepositoryModule } from '../repository/repository.module';
import { ConfigModule } from '../config/config.module';
import { DependenciesQueue } from '../queue/dependencies.queue';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    HttpModule,
    RepositoryModule,
    UsersModule,
    ConfigModule,
    QueueModule,
  ],
  controllers: [WebhooksController],
  providers: [DependenciesQueue],
})
export class WebhooksModule {}
