import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { Repository } from './repository.entity';
import { DependenciesQueue } from '../queue/dependencies.queue';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Repository]), QueueModule],
  exports: [RepositoryService],
  providers: [RepositoryService, DependenciesQueue],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
