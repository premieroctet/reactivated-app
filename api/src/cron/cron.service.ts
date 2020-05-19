import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(@InjectQueue('dependencies') private readonly queue: Queue) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  refreshAllRepositories() {
    this.queue.add('refresh_repositories');
  }
}
