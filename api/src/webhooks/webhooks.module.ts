import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksController } from './webhooks.controller';
import { RepositoryService } from '../repository/repository.service';
import { Repository } from '../repository/repository.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Repository]), UsersModule],
  controllers: [WebhooksController],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class WebhooksModule {}
