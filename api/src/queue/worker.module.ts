import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { GithubModule } from '../github/github.module';
import { LogModule } from '../log/log.module';
import { OrmModule } from '../orm.module';
import { PullRequestModule } from '../pull-request/pull-request.module';
import { RepositoryModule } from '../repository/repository.module';
import { DependenciesQueue } from './dependencies.queue';

const redisOptions = (configService: ConfigService) => {
  const config: BullModuleOptions = {
    redis: configService.get('REDIS_URL'),
    settings: {
      lockDuration: 30000 * 3,
    },
    limiter: {
      duration: 1000,
      max: Number(configService.get('MAX_JOBS_NUMBER')),
    },
    processors: [
      (job: Job, done: DoneCallback) => {
        done(null, job.data);
      },
    ],
  };

  return config;
};

const BullQueueModule = BullModule.registerQueueAsync({
  name: 'dependencies',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => redisOptions(configService),
});

@Module({
  imports: [
    BullQueueModule,
    GithubModule,
    RepositoryModule,
    PullRequestModule,
    OrmModule,
    LogModule,
  ],
  exports: [BullQueueModule],
  providers: [DependenciesQueue],
})
export class WorkerModule implements OnModuleInit {
  onModuleInit() {
    console.log('WORKER: ', process.pid);
  }
}
