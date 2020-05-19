import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [CronService],
})
export class CronModule {}
