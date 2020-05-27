import { BullModule, BullModuleOptions } from 'nest-bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

const redisOptions = (configService: ConfigService) => {
  const config: BullModuleOptions = {
    options: {
      redis: configService.get('REDIS_URL'),
      settings: {
        lockDuration: 30000 * 3,
      },
    },
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
  imports: [BullQueueModule],
  exports: [BullQueueModule],
})
export class QueueModule {}
