import { Module } from '@nestjs/common';
import { QueueModule } from '../queue/queue.module';
import { RepositoryModule } from '../repository/repository.module';
import { CronService } from './cron.service';

@Module({
  imports: [QueueModule, RepositoryModule],
  providers: [CronService],
})
export class CronModule {}
