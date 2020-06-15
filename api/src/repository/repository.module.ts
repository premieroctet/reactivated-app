import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubModule } from '../github/github.module';
import { PullRequestModule } from '../pull-request/pull-request.module';
import { QueueModule } from '../queue/queue.module';
import { UsersModule } from '../users/users.module';
import { RepositoryController } from './repository.controller';
import { Repository } from './repository.entity';
import { RepositoryService } from './repository.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repository]),
    HttpModule,
    GithubModule,
    UsersModule,
    forwardRef(() => QueueModule),
    forwardRef(() => PullRequestModule),
    ConfigModule,
  ],
  exports: [RepositoryService],
  providers: [RepositoryService],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
