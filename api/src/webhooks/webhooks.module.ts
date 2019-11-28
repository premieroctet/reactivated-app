import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksController } from './webhooks.controller';
import { RepositoryService } from '../repository/repository.service';
import { RepositoryEntity } from '../repository/repository.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity]), UsersModule],
  controllers: [WebhooksController],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class WebhooksModule {}
