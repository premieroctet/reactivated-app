import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        path.resolve(`./ormconfig.env.${process.env.NODE_ENV || 'dev'}`),
      ),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
