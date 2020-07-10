import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequest } from './pull-request.entity';
import { PullRequestService } from './pull-request.service';
import { PullRequestController } from './pull-request.controller';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PullRequest]),
    forwardRef(() => RepositoryModule),
  ],
  providers: [PullRequestService],
  exports: [PullRequestService, TypeOrmModule],
  controllers: [PullRequestController],
})
export class PullRequestModule {}
