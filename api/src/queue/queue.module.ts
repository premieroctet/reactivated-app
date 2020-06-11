import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { QueueOptions } from 'bull';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { GithubModule } from '../github/github.module';
import { OrmModule } from '../orm.module';
import { RepositoryModule } from '../repository/repository.module';

const redisOptions = (configService: ConfigService) => {
  const config: BullModuleOptions = {
    redis: configService.get('REDIS_URL'),
    settings: {
      lockDuration: 30000 * 10,
      lockRenewTime: 5000,
    },
    limiter: {
      duration: 1000,
      max: Number(configService.get('MAX_JOBS_NUMBER')),
    },
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
    forwardRef(() => RepositoryModule),
    OrmModule,
  ],
  exports: [BullQueueModule],
})
export class QueueModule {}
