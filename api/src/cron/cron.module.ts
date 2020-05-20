import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { QueueModule } from '../queue/queue.module';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [QueueModule, RepositoryModule],
  providers: [CronService],
})
export class CronModule {}
