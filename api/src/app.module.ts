import { Module, OnModuleInit } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from 'nest-bull';
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
import { join } from 'path';
import { config } from 'rxjs';
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
          processors: [join(__dirname, 'queue/worker.js')],
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('TYPEORM_CONNECTION') as 'postgres',
        host: configService.get('TYPEORM_HOST'),
        port: Number(configService.get('TYPEORM_PORT')),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: Boolean(configService.get('TYPEORM_SYNCHRONIZE')),
        // logging: process.env.NODE_ENV === 'dev',
      }),
    }),
    ConfigModule,
    AuthModule,
    WebhooksModule,
    GithubModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('MAIN: ', process.pid);
  }
}
