import { Module, OnModuleInit } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from 'nest-bull';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CronModule } from './cron/cron.module';
import { GithubModule } from './github/github.module';
import { RepositoryModule } from './repository/repository.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { OrmModule } from './orm.module';
@Module({
  imports: [
    UsersModule,
    RepositoryModule,
    ScheduleModule.forRoot(),

    BullModule.registerAsync({
      name: 'dependencies',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        options: {
          redis: configService.get('REDIS_URL'),
          // processors: [join(__dirname, 'queue/worker.js')],
          processors: [],
        },
      }),
    }),

    OrmModule,
    ConfigModule,
    AuthModule,
    WebhooksModule,
    GithubModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
