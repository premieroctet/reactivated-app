import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CronModule } from './cron/cron.module';
import { GithubModule } from './github/github.module';
import { OrmModule } from './orm.module';
import { PullRequestModule } from './pull-request/pull-request.module';
import { RepositoryModule } from './repository/repository.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    UsersModule,
    RepositoryModule,
    ScheduleModule.forRoot(),

    BullModule.registerQueueAsync({
      name: 'dependencies',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: configService.get('REDIS_URL'),
        processors: [],
      }),
    }),

    OrmModule,
    ConfigModule,
    AuthModule,
    WebhooksModule,
    GithubModule,
    CronModule,
    PullRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
