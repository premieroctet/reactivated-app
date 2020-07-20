import { Module } from '@nestjs/common';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequestModule } from '../pull-request/pull-request.module';

@Module({
  imports: [TypeOrmModule.forFeature([Log]), PullRequestModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
