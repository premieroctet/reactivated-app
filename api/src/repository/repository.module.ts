import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { Repository } from './repository.entity';
import { DependenciesQueue } from '../queue/dependencies.queue';
import { QueueModule } from '../queue/queue.module';
import { GithubModule } from '../github/github.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    HttpModule,
    GithubModule,
    TypeOrmModule.forFeature([Repository]),
    forwardRef(() => QueueModule),
    UsersModule,
  ],
  exports: [RepositoryService],
  providers: [RepositoryService, DependenciesQueue],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
