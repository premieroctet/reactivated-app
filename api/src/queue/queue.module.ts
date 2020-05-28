import { BullModule, BullModuleOptions } from 'nest-bull';
import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { Job, DoneCallback } from 'bull';
import { DependenciesQueue } from './dependencies.queue';
import { Repository } from 'typeorm';
import { RepositoryModule } from '../repository/repository.module';
import { GithubModule } from '../github/github.module';

const redisOptions = (configService: ConfigService) => {
  const config: BullModuleOptions = {
    options: {
      redis: configService.get('REDIS_URL'),
      settings: {
        lockDuration: 30000 * 3,
      },
      limiter: {
        duration: 1000,
        max: Number(configService.get('MAX_JOBS_NUMBER')),
      },
    },
    processors: [
      (job: Job, done: DoneCallback) => {
        done(null, job.data);
      },
    ],
  };

  return config;
};

const BullQueueModule = BullModule.registerAsync([
  {
    name: 'dependencies',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => redisOptions(configService),
  },
]);

@Module({
  imports: [BullQueueModule, forwardRef(() => RepositoryModule), GithubModule],
  exports: [BullQueueModule],
  providers: [DependenciesQueue],
})
export class QueueModule implements OnModuleInit {
  onModuleInit() {
    console.log('WORKER: ', process.pid);
  }
}
