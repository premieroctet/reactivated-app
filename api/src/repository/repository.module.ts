import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { RepositoryEntity } from './repository.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity])],
  exports: [RepositoryService],
  providers: [RepositoryService],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
