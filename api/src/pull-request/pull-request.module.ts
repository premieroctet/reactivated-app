import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequest } from './pull-request.entity';
import { PullRequestService } from './pull-request.service';
import { PullRequestController } from './pull-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PullRequest])],
  providers: [PullRequestService],
  exports: [PullRequestService],
  controllers: [PullRequestController],
})
export class PullRequestModule {}
