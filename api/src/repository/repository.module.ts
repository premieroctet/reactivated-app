import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { Repository } from './repository.entity';
import { DependenciesQueue } from '../queue/dependencies.queue';
import { QueueModule } from '../queue/queue.module';
import { GithubModule } from '../github/github.module';
import { GithubService } from '../github/github.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    HttpModule,
    GithubModule,
    TypeOrmModule.forFeature([Repository]),
    QueueModule,
    UsersModule,
  ],
  exports: [RepositoryService],
  providers: [RepositoryService, DependenciesQueue],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
