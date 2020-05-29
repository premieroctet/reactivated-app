import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoneCallback, Job } from 'bull';
import { BullModule, BullModuleOptions } from 'nest-bull';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { GithubModule } from '../github/github.module';
import { RepositoryModule } from '../repository/repository.module';
import { DependenciesQueue } from './dependencies.queue';
import { Repository } from '../repository/repository.entity';
import { RepositoryService } from '../repository/repository.service';
import { GithubService } from '../github/github.service';

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
  imports: [BullQueueModule, GithubModule, forwardRef(() => RepositoryModule)],
  exports: [BullQueueModule],
  providers: [DependenciesQueue],
})
export class QueueModule implements OnModuleInit {
  onModuleInit() {
    console.log('WORKER: ', process.pid);
  }
}
